from rest_framework import serializers
from ..models import Device, Sensor, SensorData


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'


class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'


class PublishDataSerializer(serializers.Serializer):
    input_data = serializers.CharField(max_length=50)
