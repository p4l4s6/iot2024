from django_filters import rest_framework as dj_filters
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from . import filters
from . import serializers
from ..models import Device, Sensor, SensorData
from ..utils.base_mqtt import publish_data, MQTT_EVENT_DISPLAY_DATA


class DeviceAPIView(ListAPIView):
    queryset = Device.objects.filter(is_active=True)
    serializer_class = serializers.DeviceSerializer


class SensorAPIView(ListAPIView):
    queryset = Sensor.objects.all()
    serializer_class = serializers.SensorSerializer
    filter_backends = (dj_filters.DjangoFilterBackend,)
    filterset_class = filters.SensorFilter


class DataAPIView(ListCreateAPIView):
    queryset = SensorData.objects.all().order_by('-created_at')
    serializer_class = serializers.SensorDataSerializer
    filter_backends = (dj_filters.DjangoFilterBackend,)
    filterset_class = filters.SensorDataFilter


class PublishDataAPI(APIView):
    @extend_schema(
        request=serializers.PublishDataSerializer,
        responses={200: serializers.PublishDataSerializer},
    )
    def post(self, request, sensor_id):
        serializer = serializers.PublishDataSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        sensor = Sensor.objects.get(id=sensor_id)
        data = serializer.data.get('input_data')
        topic = f"nodes/{sensor.device.uid}/"
        publish_data(topic, MQTT_EVENT_DISPLAY_DATA, data)
        return Response(status=status.HTTP_200_OK, data=serializer.data)
