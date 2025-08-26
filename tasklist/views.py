from datetime import timedelta
from django.utils import timezone
import uuid
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    # ✅ Mudança: username ao invés de email
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'message': 'Nome de usuário e senha são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # ✅ Mudança: buscar diretamente pelo username
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'name': user.first_name or user.username,  # ✅ Campo adicional para o frontend
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'message': 'Credenciais inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'message': 'Usuário não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)

# Modelo para tokens de reset (em produção, use um modelo de banco de dados)
class PasswordResetToken:
    tokens = {}  # Em produção, use um banco de dados ou cache
    
    @classmethod
    def create_token(cls, user):
        token = str(uuid.uuid4())
        cls.tokens[token] = {
            'user_id': user.id,
            'created_at': timezone.now(),
            'expires_at': timezone.now() + timedelta(hours=1)  # Expira em 1 hora
        }
        return token
    
    @classmethod
    def get_user_by_token(cls, token):
        token_data = cls.tokens.get(token)
        if token_data and token_data['expires_at'] > timezone.now():
            try:
                return User.objects.get(id=token_data['user_id'])
            except User.DoesNotExist:
                pass
        return None

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    # ✅ Mudança: aceitar username OU email para recuperação
    username = request.data.get('username')
    email = request.data.get('email')
    
    if not username and not email:
        return Response({
            'message': 'Nome de usuário ou email é obrigatório'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # ✅ Buscar por username ou email
        if username:
            user = User.objects.get(username=username)
        else:
            user = User.objects.get(email=email)
        
        # Verificar se o usuário tem email cadastrado
        if not user.email:
            return Response({
                'message': 'Este usuário não possui email cadastrado para recuperação'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Criar token de reset
        reset_token = PasswordResetToken.create_token(user)
        
        # URL para reset (ajuste conforme sua aplicação)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        # Enviar email
        subject = 'Recuperação de Senha - TaskManagement'
        message = f'''Olá {user.first_name or user.username},

Você solicitou a recuperação de sua senha no TaskManagement.

Clique no link abaixo para redefinir sua senha:
{reset_url}

Este link expira em 1 hora.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Equipe TaskManagement'''
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Email de recuperação enviado com sucesso'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        # Por segurança, sempre retorna sucesso mesmo se o usuário não existir
        return Response({
            'message': 'Se este usuário estiver cadastrado e possuir email, você receberá instruções para redefinir sua senha.'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'message': 'Erro interno do servidor'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request):
    token = request.data.get('token')
    new_password = request.data.get('password')
    
    if not token or not new_password:
        return Response({
            'message': 'Token e nova senha são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = PasswordResetToken.get_user_by_token(token)
    
    if not user:
        return Response({
            'message': 'Token inválido ou expirado'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Atualizar senha
    user.set_password(new_password)
    user.save()
    
    # Remover token usado
    if token in PasswordResetToken.tokens:
        del PasswordResetToken.tokens[token]
    
    return Response({
        'message': 'Senha redefinida com sucesso'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not password:
        return Response({
            'message': 'Nome de usuário e senha são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # ✅ Email é opcional, mas se fornecido, deve ser único
    if email and User.objects.filter(email=email).exists():
        return Response({
            'message': 'Este email já está cadastrado'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validação de username
    if User.objects.filter(username=username).exists():
        return Response({
            'message': 'Este nome de usuário já existe'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email or '',  # ✅ Email opcional
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Usuário criado com sucesso',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': user.first_name or user.username,  # ✅ Campo adicional
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'message': f'Erro ao criar usuário: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Nova view para verificar disponibilidade de username
@api_view(['POST'])
@permission_classes([AllowAny])
def check_username_view(request):
    username = request.data.get('username')
    
    if not username:
        return Response({
            'message': 'Nome de usuário é obrigatório'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    exists = User.objects.filter(username=username).exists()
    
    return Response({
        'available': not exists,
        'message': 'Nome de usuário disponível' if not exists else 'Nome de usuário já existe'
    }, status=status.HTTP_200_OK)

from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def test_view(request):
    return JsonResponse({
        'status': 'success',
        'message': 'API está funcionando!',
        'method': request.method
    })