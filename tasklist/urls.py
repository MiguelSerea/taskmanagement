from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_view, name='test'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/forgot-password/', views.forgot_password_view, name='forgot_password'),
    path('auth/reset-password/', views.reset_password_view, name='reset_password'),
    path('auth/check-username/', views.check_username_view, name='check_username'),
    
    # ✅ URLs para gerenciamento de usuários
    path('users/create/', views.create_user_view, name='create_user'),
    path('users/list/', views.list_users_view, name='list_users'),
    path('users/<int:user_id>/change-password/', views.change_user_password_view, name='change_user_password'),
    path('users/<int:user_id>/delete/', views.delete_user_view, name='delete_user'),
    
    # ✅ URLs para gerenciamento de tarefas
    path('tasks/list/', views.list_tasks_view, name='list_tasks'),
    path('tasks/create/', views.create_task_view, name='create_task'),
]