import sys
import threading

from django.apps import AppConfig


class SensorappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sensorapp'

    def ready(self):
        from .utils.base_mqtt import connect
        connect()
