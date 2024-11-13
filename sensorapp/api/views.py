from django_filters import rest_framework as dj_filters
from rest_framework.generics import ListAPIView, ListCreateAPIView

from . import serializers
from ..models import Device, Sensor, SensorData
from . import filters


class DeviceAPIView(ListAPIView):
    queryset = Device.objects.filter(is_active=True)
    serializer_class = serializers.DeviceSerializer


class SensorAPIView(ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = serializers.DeviceSerializer
    filter_backends = (dj_filters.DjangoFilterBackend,)
    filterset_class = filters.SensorFilter


class DataAPIView(ListCreateAPIView):
    queryset = SensorData.objects.all().order_by('-created_at')
    serializer_class = serializers.SensorDataSerializer
    filter_backends = (dj_filters.DjangoFilterBackend,)
    filterset_class = filters.SensorDataFilter
