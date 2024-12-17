import time

from django.utils import timezone
from datetime import timedelta

from ..models import Device, Sensor, SensorData


def make_device_offline():
    # Define the time threshold
    time_threshold = timezone.now() - timedelta(seconds=10)

    # Get all devices
    devices = Device.objects.filter(is_active=True)

    for device in devices:
        # Check if the device has any associated sensor
        recent_sensor_updated = Sensor.objects.filter(device=device, updated_at__gte=time_threshold).exists()

        # Check if sensor data exists for each sensor within the last 10 seconds
        recent_data_exists = SensorData.objects.filter(sensor__device=device, created_at__gte=time_threshold).exists()

        # Update the device's is_online status
        if not recent_data_exists and not recent_sensor_updated:
            device.is_online = False
            device.save()


def run_task():
    make_device_offline()
