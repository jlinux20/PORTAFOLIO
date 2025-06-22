from django.test import TestCase, Client
from django.urls import reverse
from backend.core.models import Message, Audit
import json

class IntegrationTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_contact_flow(self):
        # Enviar formulario de contacto
        data = {
            'name': 'Integration User',
            'email': 'integration@example.com',
            'company': 'Integration Corp',
            'type': 'penetration-testing',
            'message': 'Integration test message'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 200)
        message_id = response.json().get('message_id')
        self.assertIsNotNone(message_id)

        # Verificar que el mensaje fue creado
        message = Message.objects.filter(id=message_id).first()
        self.assertIsNotNone(message)
        self.assertEqual(message.email, 'integration@example.com')

        # Obtener mensajes recientes y verificar que el mensaje está presente
        response = self.client.get(reverse('recent_messages'))
        self.assertEqual(response.status_code, 200)
        messages = response.json().get('messages', [])
        self.assertTrue(any(m['email'] == 'integration@example.com' for m in messages))

    def test_audit_flow(self):
        # Crear auditoría
        audit_data = {
            'maquina': 'Test Machine',
            'ip': '192.168.1.1',
            'vulnerabilidades': 'None',
            'recomendaciones': 'Keep updated'
        }
        response = self.client.post(reverse('create_audit'), audit_data)
        self.assertEqual(response.status_code, 200)
        audit_id = response.json().get('audit_id')
        self.assertIsNotNone(audit_id)

        # Obtener auditoría
        response = self.client.get(reverse('get_audit', args=[audit_id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('maquina'), 'Test Machine')

        # Actualizar auditoría
        update_data = {
            'maquina': 'Updated Machine',
            'ip': '192.168.1.2',
            'vulnerabilidades': 'Updated vulnerabilities',
            'recomendaciones': 'Updated recommendations'
        }
        response = self.client.put(reverse('update_audit', args=[audit_id]), json.dumps(update_data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Verificar actualización
        response = self.client.get(reverse('get_audit', args=[audit_id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('maquina'), 'Updated Machine')

        # Eliminar auditoría
        response = self.client.delete(reverse('delete_audit', args=[audit_id]))
        self.assertEqual(response.status_code, 200)

        # Verificar eliminación
        response = self.client.get(reverse('get_audit', args=[audit_id]))
        self.assertEqual(response.status_code, 404)

class SecurityTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_message_sanitization_xss(self):
        xss_payload = "<script>alert('xss')</script>"
        data = {
            'name': 'XSS User',
            'email': 'xss@example.com',
            'message': xss_payload
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 200)
        message_id = response.json().get('message_id')
        message = Message.objects.get(id=message_id)
        # El mensaje debe estar sanitizado, sin etiquetas script
        self.assertNotIn('<script>', message.message)
        self.assertNotIn('</script>', message.message)

    def test_audit_sanitization_xss(self):
        xss_payload = "<script>alert('xss')</script>"
        audit_data = {
            'maquina': xss_payload,
            'ip': '192.168.1.1',
            'vulnerabilidades': xss_payload,
            'recomendaciones': xss_payload
        }
        response = self.client.post(reverse('create_audit'), audit_data)
        self.assertEqual(response.status_code, 200)
        audit_id = response.json().get('audit_id')
        audit = Audit.objects.get(id=audit_id)
        self.assertNotIn('<script>', audit.maquina)
        self.assertNotIn('<script>', audit.vulnerabilidades)
        self.assertNotIn('<script>', audit.recomendaciones)
