import datetime
import json
import logging
import time

import paho.mqtt.client as mqtt
from . import db_utils
from ..models import SensorData

# MQTT Configuration
MQTT_BROKER = "195.148.21.167"  # Replace with your broker address
MQTT_PORT = 1883
MQTT_USER = "iot2024"
MQTT_PASS = "IoT2024"
MQTT_TOPIC_ONLINE_STATUS = "online_status"
MQTT_TOPIC_SENSORS = "sensors"
MQTT_TOPIC_DATA = "sensor_data"
MQTT_EVENT_CHECK_SENSORS = "check_sensors"
MQTT_EVENT_DISPLAY_DATA = "display_data"

# Global MQTT Client
client = mqtt.Client()
logger = logging.getLogger('django')


def update_device_status(uid, is_online):
    """
    Updates the is_online status of a Device based on UID.
    """
    device = db_utils.get_device_by_uid(uid)
    if device:
        device.is_online = is_online
        device.save()


def update_device_sensors(device_uid, sensors):
    """
    Updates sensors associated with a Device based on device UID.
    """
    device = db_utils.get_device_by_uid(device_uid)
    if device:
        if sensors:
            for i2c_address in sensors:
                sensor = db_utils.get_sensor_by_device_uid_and_i2c_address(device, i2c_address)
                if sensor:
                    sensor.is_online = True
                    sensor.save()
        device.is_online = True
        device.save()


def save_sensor_data(device_uid, i2c_address, data):
    """
    Saves sensor data to the SensorData model.
    """
    device = db_utils.get_device_by_uid(device_uid)
    if device:
        sensor = db_utils.get_sensor_by_device_uid_and_i2c_address(device, i2c_address)
        if sensor:
            SensorData.objects.create(sensor=sensor, data=data).save()


def on_connect(cl, userdata, flags, rc):
    """
    Callback for when the client receives a CONNACK response from the server.
    """
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(MQTT_TOPIC_ONLINE_STATUS)
        client.subscribe(MQTT_TOPIC_SENSORS)
        client.subscribe(MQTT_TOPIC_DATA)
    else:
        print(f"Failed to connect, return code {rc}")


def on_message(cl, userdata, msg):
    """
    Callback for when a PUBLISH message is received from the server.
    """
    try:
        t2 = int(time.time() * 1000)
        payload = json.loads(msg.payload.decode('utf-8'))
        topic = msg.topic
        t1 = payload.get("timestamp")

        if topic == MQTT_TOPIC_ONLINE_STATUS:
            uid = payload.get("node_id")
            is_online = payload.get("online", False)
            update_device_status(uid, is_online)

        elif topic == MQTT_TOPIC_SENSORS:
            device_uid = payload.get("node_id")
            sensors = payload.get("sensors", [])
            update_device_sensors(device_uid, sensors)

        elif topic == MQTT_TOPIC_DATA:
            device_uid = payload.get("node_id")
            i2c_address = payload.get("i2c_address")
            data = payload.get("data")
            save_sensor_data(device_uid, i2c_address, data)

        t3 = int(time.time() * 1000)
        logger.error(f"Topic:{topic} === t1:{t1} -- t2:{t2} -- t3:{t3}")


    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
    except Exception as e:
        print(f"Error handling message: {e}")


def connect():
    """
    Connect to the MQTT broker with username and password.
    """
    try:
        client.username_pw_set(MQTT_USER, MQTT_PASS)
        client.connect(MQTT_BROKER, MQTT_PORT, 60)  # 60 seconds keepalive
        client.publish("start", "connected from backend")
        client.loop_start()
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")


# Publish Data Function
def publish_data(topic, event, data=None):
    """
    Publish data to a specified MQTT topic.
    """
    try:
        payload = {
            "event_type": event,
            "data": data
        }

        # Publish the data
        client.publish(topic, json.dumps(payload))
        print(f"Published data to topic {topic}: {json}")

    except Exception as e:
        print(f"Failed to publish data: {e}")


client.on_connect = on_connect
client.on_message = on_message
