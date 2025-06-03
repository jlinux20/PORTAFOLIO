from django.http import JsonResponse
from django.shortcuts import render
from .models import ExampleModel

def example_view(request):
    examples = ExampleModel.objects.all()
    data = {"examples": [example.name for example in examples]}
    return JsonResponse(data)

def index_view(request):
    return render(request, 'index.html')
