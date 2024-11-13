from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
]
urlpatterns += router.urls
