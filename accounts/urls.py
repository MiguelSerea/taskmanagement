from django.contrib import admin
from django.urls import path
from accounts.views import (
    RegisterView, LoginView, 
    PasswordResetRequestView, PasswordResetConfirmView,
    UserProfileView
)

urlpatterns = [
    
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]