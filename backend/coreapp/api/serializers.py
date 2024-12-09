from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from coreapp.utils import auth_utils


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        email = attrs['email']
        try:
            user = auth_utils.get_user_by_email(email)
            auth_utils.validate_user(user)
            return attrs
        except ObjectDoesNotExist:
            raise serializers.ValidationError({'mobile': [_(f"User with mobile {email} does not exist")]})
