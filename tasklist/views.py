from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

@api_view(['GET'])
@permission_classes([AllowAny])
def test_view(request):
    return JsonResponse({
        'status': 'success',
        'message': 'API está funcionando!',
        'method': request.method
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'message': 'Nome de usuário e senha são obrigatórios'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user and user.is_active:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'name': user.first_name or user.username,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'message': 'Credenciais inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)

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
    
    if User.objects.filter(username=username).exists():
        return Response({
            'message': 'Este nome de usuário já existe'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if email and User.objects.filter(email=email).exists():
        return Response({
            'message': 'Este email já está cadastrado'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email or '',
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
                'name': user.first_name or user.username,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'message': f'Erro ao criar usuário: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ Views básicas (implementar depois)
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    return Response({'message': 'Implementar recuperação de senha'})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_view(request):
    return Response({'message': 'Implementar reset de senha'})

@api_view(['POST'])
@permission_classes([AllowAny])
def check_username_view(request):
    username = request.data.get('username')
    if not username:
        return Response({'message': 'Username obrigatório'}, status=400)
    
    exists = User.objects.filter(username=username).exists()
    return Response({
        'available': not exists,
        'message': 'Username disponível' if not exists else 'Username já existe'
    })

# Views para implementar depois
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user_view(request):
    return Response({'message': 'Implementar criação de usuário'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users_view(request):
    return Response({'message': 'Implementar listagem de usuários'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_user_password_view(request, user_id):
    return Response({'message': 'Implementar mudança de senha'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_view(request, user_id):
    return Response({'message': 'Implementar exclusão de usuário'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_tasks_view(request):
    return Response({'message': 'Implementar listagem de tarefas'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task_view(request):
    return Response({'message': 'Implementar criação de tarefa'})