import uuid

from django.db import models
from coreapp.base import BaseModel
from sensorapp.constants import SensorType


# Create your models here.

class Device(BaseModel):
    uid = models.UUIDField(unique=True, editable=False, db_index=True, default=uuid.uuid4)
    name = models.CharField(max_length=100)
    desc = models.TextField(null=True, blank=True)
    is_online = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Sensor(BaseModel):
    uid = models.UUIDField(unique=True, editable=False, db_index=True, default=uuid.uuid4)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    i2c_address = models.CharField(max_length=100)
    desc = models.TextField(null=True, blank=True)
    is_online = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    sensor_type = models.SmallIntegerField(choices=SensorType.choices, default=SensorType.INPUT)

    def __str__(self):
        return self.name


class SensorData(BaseModel):
    uid = models.UUIDField(unique=True, editable=False, db_index=True, default=uuid.uuid4)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    data = models.JSONField()
