#include <WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>

#include <MicroTFLite.h>
#include "temp_anomaly_model.h"  // Your converted model in C array format

// Define Tensor Arena memory for TFLite Micro (adjust size based on model)
constexpr int kTensorArenaSize = 8192; // 8KB tensor arena
alignas(16) uint8_t tensor_arena[kTensorArenaSize];

// Input and Output Data Buffer (depending on model's tensor dimensions)
constexpr int kInputLength = 10;  // Input size: 10 temperature readings
float input_data[kInputLength];

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1  // Reset pin (-1 if sharing Arduino reset pin)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
Adafruit_BMP280 bmp; 
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);

// WiFi and MQTT details
const char* ssid = "B33";
const char* password = "q1ghost567";
const char* mqtt_server = "195.148.21.167";
const int mqtt_port = 1883;
const char* mqtt_username = "iot2024";
const char* mqtt_password = "IoT2024";

WiFiClient espClient;
PubSubClient client(espClient);

const char* node_id = "6ed19aa6-867a-4ff2-9fd7-1d7e45a45fba";

void connectToWiFi() {
    delay(10);
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid,password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("Connected to WiFi");
}

String getCurrentTime() {
  timeClient.update();

  // Get the current time in seconds from NTP
  unsigned long epochTimeInSeconds = timeClient.getEpochTime();

  // Get milliseconds since NTP last updated
  unsigned long currentMillis = millis(); // Milliseconds since the last restart

  // Convert epoch time (seconds) to milliseconds and add the current milliseconds
  unsigned long long epochTimeInMilliseconds = (unsigned long long)epochTimeInSeconds * 1000 + currentMillis;

  char epochTimeStr[20];  // Enough space for the number

  // Format the unsigned long long value into the string
  sprintf(epochTimeStr, "%llu", epochTimeInMilliseconds);

  // Convert to String
  return String(epochTimeStr);
}

void iAmOnline(){
  unsigned long start_time= millis();
  // Construct the JSON payload with node_id and event_type
  String payload = "{\"node_id\": \"" + String(node_id) + "\", \"timestamp\": " + getCurrentTime() + ",\"online\": true}";
  // Publish to the "online_status" topic
  client.publish("online_status", payload.c_str());
  unsigned long end_time= millis();
  Serial.println(String(end_time-start_time));
}

void connectToMQTT() {
    while (!client.connected()) {
        Serial.print("Connecting to MQTT...");
        if (client.connect(node_id, mqtt_username, mqtt_password)) {
            Serial.println("Connected to MQTT broker");
            iAmOnline();
            // Subscribe to the "nodes/{UUID}/" topic for this node
            client.subscribe(String("nodes/" + String(node_id) + "/").c_str());
        } else {
            Serial.print("Failed, rc=");
            Serial.print(client.state());
            Serial.println(" Trying again in 5 seconds");
            delay(5000);
        }
    }
}

// Function to perform I2C scan and publish results
void performI2CScanAndPublish() {
    String timestamp=String(getCurrentTime());
    Serial.println("Scanning I2C bus...");
    String payload = "{\"node_id\": \"" + String(node_id) + "\",\"timestamp\": " + timestamp + ", \"sensors\": [";
    bool foundDevice = false;
    
    for (uint8_t address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        if (Wire.endTransmission() == 0) {
            if (foundDevice) payload += ", ";  // Add a comma separator if multiple devices are found
            payload += "\"" + String(address, HEX) + "\"";
            Serial.print("Found device at address 0x");
            Serial.println(address, HEX);
            foundDevice = true;
        }
    }

    payload += "]}";
    client.publish("sensors", payload.c_str());
    Serial.println("Publishing sensor data: " + payload);
}

void displayDataOnScreen(const char* data) {
    // Display the data on the screen
    display.clearDisplay();                 // Clear the display
    display.setTextColor(SSD1306_WHITE);   // Draw white text
    display.setCursor(0, 0);                // Start at top-left corner
    display.setTextSize(2);                 // Larger text size
    display.println(data);                 // Dynamic data
    display.display();                      // Update the display
    Serial.printf("Displayed: %s \n", data);
}


void callback(char* topic, byte* payload, unsigned int length) {
    // Convert the payload to a null-terminated string
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';

    Serial.printf("Message arrived on topic: %s, message: %s\n", topic, message);

    // Parse the JSON payload
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
        Serial.println("Failed to parse JSON");
        return;
    }

    // Check for event_type and handle appropriately
    const char* eventType = doc["event_type"];
    if (eventType) {
        if (strcmp(eventType, "check_sensors") == 0) {
            Serial.println("Event type is check_sensors. Initiating I2C scan...");
            performI2CScanAndPublish();
        } else if (strcmp(eventType, "display_data") == 0) {
            Serial.println("Event type is display_data. Showing data on screen...");
            const char* data = doc["data"];
            displayDataOnScreen(data);
        }
    } else {
        Serial.println("Missing event_type field.");
    }
}

bool runAIModel(float temp, float pressure) {
  for (int i = 0; i < kInputLength; i++) {
      input_data[i] = bmp.readTemperature();
  }
  // Set input tensor data
    for (int i = 0; i < kInputLength; i++) {
        if (!ModelSetInput(input_data[i], i, true)) {
            Serial.println("Failed to set input!");
            return false;
        }
    }

    // Run inference
    Serial.println("Running inference...");
    if (!ModelRunInference()) {
        Serial.println("Inference failed!");
        return false;
    }

    // Get the model output
    float reconstruction = ModelGetOutput(0);


    float threshold = 10.65;  // Adjust based on model calibration
    float error = abs(input_data[0] - reconstruction);
    Serial.print("Reconstruction: ");
    Serial.println(error);

    if (error > threshold) {
      Serial.println("Anomaly detected!");
      return true;
    } else {
      Serial.println("Normal data.");
      return false;
    }

}

void publishSensorData() {
     float temperature_data[10] = {};


    // Read sensor data
    float temperature = bmp.readTemperature();  // In °C
    float pressure = bmp.readPressure() / 100.0F; // Convert to hPa

    // Create a JSON document
     StaticJsonDocument<256> doc;
    doc["node_id"] = node_id;
    doc["i2c_address"] = "0x76";

    // Create a nested "data" object
    JsonObject data = doc.createNestedObject("data");
    data["temp"] = temperature;
    data["pressure"] = pressure;
    data["is_anomaly"] = runAIModel(temperature, pressure);
    doc["timestamp"] = String(getCurrentTime());

    // Serialize JSON to a string
    char payload[200];
    serializeJson(doc, payload);

    // Publish the JSON string to the "sensor_data" topic
    client.publish("sensor_data", payload);

    Serial.println("Published sensor data:");
    Serial.println(payload);
}

void setup() {
    Serial.begin(115200);
    connectToWiFi();
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(callback);
    connectToMQTT();

    Wire.setSDA(0);
    Wire.setSCL(1);
    Wire.begin();

    timeClient.begin();
     // Initialize the TFLite model
    if (!ModelInit(temp_anomaly_model_tflite, tensor_arena, kTensorArenaSize))
    {
        Serial.println("Model initialization failed!");
        while (true);  // Halt on failure
    }
    Serial.println("Model initialization successful!");

    // Optional: Print model metadata and tensor dimensions
    ModelPrintMetadata();
    ModelPrintInputTensorDimensions();
    ModelPrintOutputTensorDimensions();

    if (!bmp.begin(0x76)) {  // Default I2C address for BME280 is 0x77; change to 0x76 if needed
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while (true);
    }

    // Initialize the OLED display
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {  // Check if OLED is connected at 0x3C
        Serial.println("SSD1306 allocation failed");
        while (true); // Don't proceed if display init fails
    }
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.println("System Ready...");
    display.display();

}

void loop() {
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();
    publishSensorData();
    delay(100);
}
