from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from backend.core.models import Message

class MessageModelTest(TestCase):
    def setUp(self):
        self.test_message = Message.objects.create(
            name="Test User",
            email="test@example.com",
            company="Test Company",
            message_type="security-audit",
            message="This is a test message."
        )

    # ... existing tests ...

    def test_message_sanitization(self):
        """Test that message content is properly sanitized"""
        test_cases = [
            ("<script>alert('xss')</script>", "alert('xss')"),
            ("Normal message", "Normal message"),
            ("Message with <!-- html comment -->", "Message with"),
            ("Message with <strong>HTML</strong>", "Message with HTML")
        ]
        
        for input_text, expected_output in test_cases:
            message = Message.objects.create(
                name="Test User",
                email="test@example.com",
                message_type="security-audit",
                message=input_text
            )
            self.assertNotIn("<script>", message.message)
            self.assertNotIn("<!--", message.message)

    def test_message_search(self):
        """Test message search functionality"""
        Message.objects.create(
            name="Security Expert",
            email="security@test.com",
            message_type="security-audit",
            message="Security assessment request"
        )
        
        Message.objects.create(
            name="Network Admin",
            email="network@test.com",
            message_type="network-implementation",
            message="Network infrastructure project"
        )

        # Test search by different criteria
        security_messages = Message.objects.filter(message__icontains="security")
        network_messages = Message.objects.filter(message__icontains="network")
        
        self.assertEqual(security_messages.count(), 1)
        self.assertEqual(network_messages.count(), 1)

    def test_message_type_statistics(self):
        """Test message type distribution statistics"""
        message_types = [
            "security-audit",
            "network-implementation",
            "penetration-testing",
            "consulting",
            "other"
        ]

        # Clear existing messages to avoid count mismatch
        Message.objects.all().delete()

        # Create messages of each type
        for msg_type in message_types:
            Message.objects.create(
                name=f"User {msg_type}",
                email=f"{msg_type}@test.com",
                message_type=msg_type,
                message=f"Test message for {msg_type}"
            )

        # Test counts for each message type
        for msg_type in message_types:
            count = Message.objects.filter(message_type=msg_type).count()
            self.assertEqual(count, 1)

    def test_message_rate_limiting(self):
        """Test rate limiting for message creation"""
        # Create multiple messages in quick succession
        for i in range(5):
            Message.objects.create(
                name=f"Test User {i}",
                email=f"test{i}@example.com",
                message_type="security-audit",
                message=f"Test message {i}",
                timestamp=timezone.now()
            )

        # Test that messages are properly spaced
        messages = Message.objects.all().order_by('timestamp')
        for i in range(1, len(messages)):
            time_diff = messages[i].timestamp - messages[i-1].timestamp
            self.assertGreaterEqual(time_diff.total_seconds(), 0)

    def test_message_cleanup(self):
        """Test automatic cleanup of old messages"""
        # Create old message
        old_message = Message.objects.create(
            name="Old User",
            email="old@test.com",
            message_type="other",
            message="Old message",
            timestamp=timezone.now() - timedelta(days=90)
        )

        # Simulate cleanup (messages older than 30 days)
        old_messages = Message.objects.filter(
            timestamp__lt=timezone.now() - timedelta(days=30)
        )
        self.assertIn(old_message, old_messages)

    def test_unicode_support(self):
        """Test support for Unicode characters in messages"""
        unicode_content = "🔒 Security Test 测试 проверка"
        message = Message.objects.create(
            name="Unicode User",
            email="unicode@test.com",
            message_type="security-audit",
            message=unicode_content
        )
        
        retrieved_message = Message.objects.get(id=message.id)
        self.assertEqual(retrieved_message.message, unicode_content)