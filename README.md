# IoT-Based Monitoring System

## Introduction

This project focuses on building a robust IoT-based monitoring system utilizing Raspberry Pi Pico W, BMP sensors, machine learning, and MQTT communication. The system is designed to efficiently manage sensor nodes, collect environmental data, and provide real-time analytics and insights through a user-friendly dashboard.

---

## Contributors
- Raisul Islam (raisul.islam@student.oulu.fi)
- Md Mobusshar Islam (mislam23@student.oulu.fi)
- Nazmul Mahmud (nmahmud23@student.oulu.fi)
- Xiru Chen (xchen24@student.oulu.fi)

## Objective

The primary goal of this project is to create a scalable, responsive, and efficient IoT solution that can:

- Detect and monitor the status of sensors in a network of IoT nodes.
- Collect real-time data from sensors and analyze it using lightweight TinyML models.
- Provide actionable insights and alerts via a web-based dashboard.
- Support seamless communication between hardware nodes and a backend server.

---

## Implementation Details

### Architecture
![ImplementationPlan drawio](https://github.com/user-attachments/assets/1ae61abb-177d-4cdd-8f5c-ce6e2d3c012f)



### Database
![auth_group](https://github.com/user-attachments/assets/565622a5-e3c8-4404-b489-7608caf743b0)


### Backend

The backend is built using Django to ensure a robust architecture for managing devices and their data.

#### Key Features

- **Models**:
  - `Device/Node`: Represents each Raspberry Pi Pico node, identified by UUID.
  - `Sensor`: Linked to specific devices, stores metadata (type, status, model).
  - `Sensor Data`: Tracks sensor readings with timestamps.

- **API Development**:
  - Built using Django REST Framework (DRF) for authentication, status updates, and data retrieval.
  - APIs documented with Swagger for ease of testing and integration.

- **MQTT Communication**:
  - Facilitates real-time node management (e.g., identifying active nodes).
  - Handles sensor status checks and data requests via event-based messages.

- **Deployment**:
  - Hosted on Ubuntu 24.04 LTS with PostgreSQL for scalability.
  - Integrated Eclipse Mosquitto as the MQTT broker.

---

### Frontend

The frontend provides an interactive and responsive interface for system monitoring.

#### Key Features

- **Dashboard**:
  - Displays real-time statuses of nodes and sensors.
  - Alerts for offline nodes or malfunctioning sensors.
  - Visualizes sensor data using libraries like Chart.js or D3.js.

- **Real-Time Updates**:
  - Implements long polling for fetching updates from the backend.

---

### Hardware

Hardware implementation involves setting up Raspberry Pi Pico nodes with BMP sensors and on-device TinyML capabilities.

#### Key Features

- **Node Configuration**:
  - Sensor data collected over I2C interface.
  - Communication with the MQTT broker via Wi-Fi.

- **TinyML Integration**:
  - Embedded lightweight models for on-device analysis.
  - Nodes send processed data or predictions to the backend.

- **Testing**:
  - Verifies connectivity, sensor functionality, and MQTT message handling.

---

## How to Use

### Prerequisites

Ensure the following tools and hardware components are available and properly set up:

- **Software**:
  - Python (3.8 or higher)
  - PostgreSQL
  - MQTT Broker (e.g., Eclipse Mosquitto)
  - Arduino IDE
- **Hardware**:
  - Raspberry Pi Pico W
  - BMP Sensor
  - SSD1306 Display

---

### General Instructions

1. **Clone the Repository**:
    ```
       git clone https://github.com/p4l4s6/iot2024.git
       cd iot2024/
    ```

### Backend Setup

1. Move to backend folder and create a Virtual Environment:
      ```
      cd backend/
      python3 -m venv venv
      ```

2. Activate the Virtual Environment:

    **On Linux/macOS**:
      ```
       source venv/bin/activate
      ```
    
    **On Windows**:
      ```
        .\venv\Scripts\activate
      ```

3. Install Requirements:
      ```
      pip install -r requirements.txt
      ```

4. Copy the .env.example file to .env 

    Update the .env file with your configuration details (e.g., database credentials, MQTT broker settings).


5. Run Migrations:
      ```
      python manage.py makemigrations
      python manage.py migrate
      ```

6. Start the Development Server:
      ```
      python manage.py runserver
      ```

### Hardware Setup

1. Open the Arduino IDE and install the necessary libraries:
   - ArduinoJSON
   - PubSubClient
   - Adafruit BMP
   - Adafruit SSD1306

2. Navigate to the hardware folder in the repository and open the .ino file.
3. Change the Node ID, Wi-Fi credentials, and MQTT broker credentials in the .ino file.
4. Connect the Raspberry Pi Pico W to your computer
5. Flash the updated firmware onto the device.

---


## Evaluation of the Centralized IoT Sensor Network

The evaluation of the system focuses on its functionality, performance, scalability, and reliability under various operational scenarios. Using synthetic data and the specified architecture, we analyze the system’s behavior and metrics across three scenarios: fully operational, partial availability, and mixed status.

---

### **Scenario 1: Fully Operational System**

In this scenario, all nodes are online and functional, providing an optimal testing ground for the system's capabilities.

**Observations:**
1. **Node Check-In**: All nodes successfully responded to the server’s check-in request, confirming their online status.
2. **Sensor Data Collection**: Sensor availability was confirmed, and all sensors provided accurate readings.
3. **Real-Time Monitoring**: The frontend dashboard displayed data without noticeable lag.
4. **TinyML Predictions**: Embedded TinyML models ran smoothly on all nodes, producing timely and accurate predictions.


---

### **Scenario 2: Partial Availability (One Node Offline)**

This scenario simulated a partially degraded system where one node was offline while the other nodes operated normally.

**Observations:**
1. **Node Check-In**: Two nodes responded, while one was correctly marked as offline.
2. **Sensor Data Collection**: The system successfully verified sensor availability for the online nodes and collected their data.
3. **Dashboard Updates**: Data from the active nodes was displayed with slight delays due to the reduced node count.
4. **TinyML Predictions**: Predictions were generated only for the online nodes.


---

### **Scenario 3: Mixed Status (One Node with Non-Functional Sensor)**

This scenario tested the system’s ability to handle mixed operational conditions, including an offline node and a node with a faulty sensor.

**Observations:**
1. **Node Check-In**: Two nodes were online, and one was offline, correctly displayed on the dashboard.
2. **Sensor Availability**: One online node reported a non-functional sensor, which the system handled gracefully by excluding it from data collection.
3. **Data Collection and Predictions**: Valid data was collected only from the functional sensor, and predictions were limited to one node.
4. **Error Reporting**: The dashboard provided clear alerts for the faulty sensor and offline node.
---

### Latency
| Scenario                        | Precision Score |
|---------------------------------|-----------------|
| Device to MQTT Broker  | **10 ms**       |
| MQTT Broker to Backend  | **30 ms**       |
| Backend to Database Save  | **10 ms**       |
| Frontend to Backend HTTP POST  | **10 ms**       |
| Backend to Device via MQTT  | **10 ms**       |
| Device Display Response  | **10 ms**       |
| End-to-End Latency | **10 ms**       |


---
## Future Work

- Implement more advanced data analytics and visualization tools in the dashboard.
- Add support for additional sensor types to expand functionality.
- Explore edge computing enhancements to optimize processing.
- Develop mobile applications for on-the-go monitoring.

---

Feel free to reach out for any questions or collaboration! 🚀
