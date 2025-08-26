from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_view, name='test'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('auth/reset-password/', views.reset_password_view, name='reset_password'),
    path('auth/check-username/', views.check_username_view, name='check_username'),  # ✅ Nova URL
]