from django.test import TestCase, Client
from django.urls import reverse
from backend.core.models import Message
from django.utils import timezone

class CoreViewsTest(TestCase):
    def setUp(self):
        # ...existing code...
        self.client = Client()
        # Create test message
        self.test_message = Message.objects.create(
            name="Test User",
            email="test@example.com",
            company="Test Corp",
            message_type="security-audit",
            message="Test message content",
            timestamp=timezone.now()
        )

    # ...existing code...

    def test_contact_form_submission(self):
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'company': 'Test Company',
            'type': 'penetration-testing',
            'message': 'Test contact message'
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Message.objects.filter(email='john@example.com').exists())

    def test_recent_messages_view(self):
        response = self.client.get(reverse('recent_messages'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('messages', response.json())
        self.assertEqual(len(response.json()['messages']), 1)

    def test_invalid_contact_form_submission(self):
        data = {
            'name': '',  # Empty name should fail
            'email': 'invalid-email',  # Invalid email
            'message': ''  # Empty message
        }
        response = self.client.post(reverse('contact'), data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('errors', response.json())

class MessageModelTest(TestCase):
    def setUp(self):
        self.message = Message.objects.create(
            name="Test User",
            email="test@example.com",
            company="Test Corp",
            message_type="security-audit",
            message="Test message content"
        )

    def test_message_creation(self):
        self.assertTrue(isinstance(self.message, Message))
        self.assertEqual(str(self.message), f"Message from {self.message.name}")

    def test_message_timestamps(self):
        self.assertIsNotNone(self.message.timestamp)
        self.assertTrue(timezone.is_aware(self.message.timestamp))

    def test_message_fields_max_length(self):
        max_length = Message._meta.get_field('name').max_length
        self.assertEqual(max_length, 100)

        max_length = Message._meta.get_field('email').max_length
        self.assertEqual(max_length, 254)

class ContactFormTest(TestCase):
    def test_required_fields(self):
        form_data = {}
        response = self.client.post(reverse('contact'), form_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('name', response.json()['errors'])
        self.assertIn('email', response.json()['errors'])
        self.assertIn('message', response.json()['errors'])

    def test_email_validation(self):
        form_data = {
            'name': 'Test User',
            'email': 'invalid-email',
            'message': 'Test message'
        }
        response = self.client.post(reverse('contact'), form_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.json()['errors'])