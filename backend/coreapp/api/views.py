from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers
from ..models import LoginHistory
from ..utils import auth_utils


class LoginView(APIView):
    permission_classes = [AllowAny, ]

    @extend_schema(
        request=serializers.LoginSerializer,
        responses={200: serializers.LoginSerializer},
    )
    def post(self, request, *args, **kwargs):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = auth_utils.get_user_by_email(email)
            ip, user_agent = auth_utils.get_client_info(request)
            login_history = LoginHistory.objects.create(
                user=user, ip_address=ip, user_agent=user_agent
            )
            if user.check_password(password):
                login_history.is_success = True
                data = {
                    'id': user.pk,
                    'email': user.email,
                    'mobile': user.mobile,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_verified': user.is_verified
                }
                if user.is_verified:
                    token, created = auth_utils.regenerate_token(user=user)
                    data['token'] = token.key
                login_history.save()
                return Response(data, status=status.HTTP_200_OK)
            return Response({'detail': _("Invalid login credentials")}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
