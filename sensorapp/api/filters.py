from django_filters import rest_framework as dj_filters

from sensorapp.models import Sensor, SensorData


class SensorFilter(dj_filters.FilterSet):
    class Meta:
        model = Sensor
        fields = ('device',)


class SensorDataFilter(dj_filters.FilterSet):
    class Meta:
        model = SensorData
        fields = ('sensor',)
