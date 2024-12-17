from sensorapp.models import Device, Sensor


def get_device_by_uid(uid):
    """
    Retrieve a Device instance by its UID.

    Args:
        uid (str): The unique identifier (UUID) of the Device.

    Returns:
        Device: The matching Device instance, or None if not found.
    """
    try:
        return Device.objects.get(uid=uid, is_active=True)
    except Device.DoesNotExist:
        print(f"Device with UID {uid} does not exist.")
        return None


def get_sensor_by_device_uid_and_i2c_address(device, i2c_address):
    """
    Retrieve a Sensor instance associated with a Device, based on the device UID and I2C address.

    Args:
        device (object): The object of the Device.
        i2c_address (str): The I2C address of the Sensor.

    Returns:
        Sensor: The matching Sensor instance, or None if not found.
    """
    try:
        return Sensor.objects.get(device=device, i2c_address=f"0x{i2c_address}", is_active=True)
    except Sensor.DoesNotExist:
        print(f"Sensor with I2C address {i2c_address} does not exist for Device {device}.")
        return None
