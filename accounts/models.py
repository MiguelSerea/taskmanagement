from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    reset_token = models.CharField(max_length=100, blank=True, null=True)
    reset_token_expiration = models.DateTimeField(blank=True, null=True)

    def generate_reset_token(self):
        self.reset_token = str(uuid.uuid4())
        self.reset_token_expiration = timezone.now() + timezone.timedelta(hours=1)
        self.save()
        return self.reset_token

    def is_reset_token_valid(self, token):
        return (self.reset_token == token and 
                self.reset_token_expiration and 
                timezone.now() < self.reset_token_expiration)