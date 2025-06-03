from django.test import TestCase
from django.urls import reverse
from .models import ExampleModel

class CoreViewsTest(TestCase):
    def setUp(self):
        ExampleModel.objects.create(name="Test Example 1")
        ExampleModel.objects.create(name="Test Example 2")

    def test_index_view_status_code(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_index_view_template_used(self):
        response = self.client.get(reverse('index'))
        self.assertTemplateUsed(response, 'index.html')

    def test_example_view_status_code(self):
        response = self.client.get(reverse('example'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('examples', response.json())
        self.assertEqual(len(response.json()['examples']), 2)

class ExampleModelTest(TestCase):
    def test_str_representation(self):
        example = ExampleModel(name="Sample Name")
        self.assertEqual(str(example), "Sample Name")
