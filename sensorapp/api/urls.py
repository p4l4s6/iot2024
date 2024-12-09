from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path('device/', views.DeviceAPIView.as_view(), name='device'),
    path('sensor/', views.SensorAPIView.as_view(), name='sensor'),
    path('sensor/publish/<int:sensor_id>/', views.PublishDataAPI.as_view(), name='publish'),
    path('data/', views.DataAPIView.as_view(), name='data'),
]
urlpatterns += router.urls
