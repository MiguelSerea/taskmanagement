import logging  # <-- Adicione esta linha
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.http import JsonResponse
from .models import CustomUser
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from django.contrib.auth import get_user_model


logger = logging.getLogger(__name__)
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        
        # Generate username if not provided
        if 'username' not in data:
            email = data.get('email', '')
            data['username'] = email.split('@')[0] if email else ''
        
        try:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            token, created = Token.objects.get_or_create(user=user)
            
            # Send welcome email
            self._send_welcome_email(user)
            
            headers = self.get_success_headers(serializer.data)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED, headers=headers)
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e) if settings.DEBUG else 'Registration failed'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def _send_welcome_email(self, user):
        subject = 'Welcome to Our Platform'
        html_message = render_to_string('emails/welcome.html', {
            'user': user,
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(
                request,
                username=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            if not user:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'user': UserSerializer(user).data
            }
            
            # Platform-specific response
            is_mobile = request.headers.get('X-Platform') in ['android', 'ios']
            
            if is_mobile:
                return Response(response_data)
            else:
                response = JsonResponse(response_data)
                response.set_cookie(
                    'authToken',
                    token.key,
                    httponly=True,
                    samesite='Lax',
                    secure=request.is_secure(),
                    max_age=3600 * 24 * 7  # 1 week
                )
                return response
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response(
                {'error': 'Login failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower()
        
        try:
            user = CustomUser.objects.get(email=email)
            token = user.generate_reset_token()
            
            # Send password reset email
            self._send_reset_email(user, token)
            
            return Response({
                'message': 'If this email is registered, you will receive a password reset link'
            })
            
        except CustomUser.DoesNotExist:
            # Don't reveal whether email exists for security
            return Response({
                'message': 'If this email is registered, you will receive a password reset link'
            })
        except Exception as e:
            logger.error(f"Password reset request error: {str(e)}")
            return Response(
                {'error': 'Password reset failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _send_reset_email(self, user, token):
        subject = 'Password Reset Request'
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        
        html_message = render_to_string('emails/password_reset.html', {
            'user': user,
            'reset_link': reset_link,
            'token': token,
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = CustomUser.objects.get(reset_token=token)
            
            if not user.is_reset_token_valid(token):
                return Response(
                    {'error': 'Invalid or expired token'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_expiration = None
            user.save()
            
            # Invalidate all existing tokens
            Token.objects.filter(user=user).delete()
            
            return Response({'message': 'Password reset successfully'})
            
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Password reset confirm error: {str(e)}")
            return Response(
                {'error': 'Password reset failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user