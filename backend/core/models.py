from django.db import models
from django.utils import timezone

# Removed ExampleModel to fix import error

import re
from django.db import models
from django.utils import timezone

class Message(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True)
    message_type = models.CharField(max_length=50, choices=[
        ('security-audit', 'Auditoría de Seguridad'),
        ('network-implementation', 'Implementación de Redes'),
        ('penetration-testing', 'Penetration Testing'),
        ('consulting', 'Consultoría General'),
        ('other', 'Otro'),
    ])
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        # Sanitize message content by removing script tags and html comments
        sanitized_message = re.sub(r'<script.*?>.*?</script>', '', self.message, flags=re.IGNORECASE|re.DOTALL)
        sanitized_message = re.sub(r'<!--.*?-->', '', sanitized_message, flags=re.DOTALL)
        self.message = sanitized_message.strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Message from {self.name}"
