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

import re

class Audit(models.Model):
    maquina = models.CharField(max_length=100)
    ip = models.CharField(max_length=20)
    vulnerabilidades = models.TextField()
    recomendaciones = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        # Sanitizar campos de texto para eliminar etiquetas script y comentarios HTML
        def sanitize(text):
            text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.IGNORECASE|re.DOTALL)
            text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
            return text.strip()

        self.maquina = sanitize(self.maquina)
        self.vulnerabilidades = sanitize(self.vulnerabilidades)
        self.recomendaciones = sanitize(self.recomendaciones)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Audit of {self.maquina}"

class AuditAction(models.Model):
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, related_name='actions')
    command = models.CharField(max_length=255)
    arguments = models.TextField(blank=True)
    output = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Action '{self.command}' for Audit {self.audit.id} at {self.timestamp}"
