from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework.authtoken.models import Token
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message=_("This email is already in use.")
        )],
        error_messages={
            'required': _("Email is required."),
            'invalid': _("Enter a valid email address.")
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        error_messages={
            'required': _("Password is required."),
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': _("Password confirmation is required."),
        }
    )
    first_name = serializers.CharField(
        required=True,
        max_length=30,
        error_messages={
            'required': _("First name is required."),
            'max_length': _("First name cannot be longer than 30 characters.")
        }
    )
    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=30,
        error_messages={
            'max_length': _("Last name cannot be longer than 30 characters.")
        }
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2',
                 'first_name', 'last_name')
        extra_kwargs = {
            'username': {
                'required': False  # Vamos gerar automaticamente
            }
        }

    def validate_email(self, value):
        """Normaliza o email para lowercase"""
        return value.lower().strip()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password2": _("Passwords do not match.")})
        
        # Gera username automaticamente se não fornecido
        if not attrs.get('username'):
            attrs['username'] = attrs['email'].split('@')[0]
            
            # Verifica se username já existe
            if User.objects.filter(username=attrs['username']).exists():
                attrs['username'] = attrs['username'] + str(User.objects.count())
                
        return attrs

    def create(self, validated_data):
        """Cria o usuário com os dados validados"""
        validated_data.pop('password2')  # Remove campo de confirmação
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', '')
        )
        
        # Cria token automaticamente
        Token.objects.create(user=user)
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': _("Email is required."),
            'invalid': _("Enter a valid email address.")
        }
    )
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': _("Password is required."),
        }
    )

    def validate(self, attrs):
        email = attrs.get('email').lower().strip()
        password = attrs.get('password')
        
        # Verifica se usuário existe
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": _("User with this email does not exist.")})
        
        # Autentica o usuário
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        
        if not user:
            raise serializers.ValidationError(
                {"password": _("Invalid password.")})
                
        if not user.is_active:
            raise serializers.ValidationError(
                {"email": _("User account is disabled.")})
                
        attrs['user'] = user
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': _("Email is required."),
            'invalid': _("Enter a valid email address.")
        }
    )

    def validate_email(self, value):
        email = value.lower().strip()
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError(_("No user found with this email address."))
        return email

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(
        required=True,
        error_messages={
            'required': _("Token is required."),
        }
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        error_messages={
            'required': _("New password is required."),
        }
    )
    confirm_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        error_messages={
            'required': _("Password confirmation is required."),
        }
    )

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"confirm_password": _("Passwords do not match.")})
        
        # Verifica se o token é válido
        try:
            user = User.objects.get(reset_token=attrs['token'])
            if not user.is_reset_token_valid(attrs['token']):
                raise serializers.ValidationError(
                    {"token": _("Invalid or expired token.")})
            attrs['user'] = user
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"token": _("Invalid or expired token.")})
                
        return attrs