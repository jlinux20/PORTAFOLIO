from django.test import TestCase, Client
from django.urls import reverse
from backend.core.models import Message, Audit
import json

class ValidationEdgeCaseTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_contact_missing_fields(self):
        # Enviar formulario sin campos requeridos
        data = {}
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        errors = response.json().get('errors', {})
        self.assertIn('name', errors)
        self.assertIn('email', errors)
        self.assertIn('message', errors)

    def test_contact_invalid_email(self):
        data = {
            'name': 'User',
            'email': 'invalid-email',
            'message': 'Test message'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        errors = response.json().get('errors', {})
        self.assertIn('email', errors)

    def test_audit_missing_fields(self):
        # Enviar auditoría con campos faltantes
        data = {}
        response = self.client.post(reverse('create_audit'), data)
        self.assertEqual(response.status_code, 500)  # Actualmente lanza error servidor
        errors = response.json().get('errors', {})
        self.assertIn('server', errors)

    def test_audit_invalid_ip(self):
        # IP inválida no validada explícitamente, pero se puede probar
        data = {
            'maquina': 'Machine',
            'ip': 'invalid-ip',
            'vulnerabilidades': 'None',
            'recomendaciones': 'None'
        }
        response = self.client.post(reverse('create_audit'), data)
        # Ahora se espera error 400 por validación
        self.assertEqual(response.status_code, 400)

    def test_contact_whitespace_fields(self):
        data = {
            'name': '   ',
            'email': '   ',
            'message': '   '
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        errors = response.json().get('errors', {})
        self.assertIn('name', errors)
        self.assertIn('email', errors)
        self.assertIn('message', errors)
