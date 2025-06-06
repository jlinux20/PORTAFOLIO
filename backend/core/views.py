from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Message
import json

def index_view(request):
    return render(request, 'index.html')

@csrf_exempt
@require_http_methods(["POST"])
def contact_view(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST.dict()
    except json.JSONDecodeError:
        return JsonResponse({'errors': {'body': 'Invalid JSON'}}, status=400)

    # Validate required fields
    errors = {}
    required_fields = {
        'name': 'Name is required',
        'email': 'Email is required',
        'message': 'Message is required'
    }

    # Check for missing or empty required fields
    for field, error_message in required_fields.items():
        if not data.get(field, '').strip():
            errors[field] = error_message

    # Validate email format if provided
    if data.get('email'):
        try:
            validate_email(data['email'])
        except ValidationError:
            errors['email'] = 'Invalid email address'

    if errors:
        return JsonResponse({'errors': errors}, status=400)

    # Create message
    try:
        message = Message.objects.create(
            name=data['name'].strip(),
            email=data['email'].strip(),
            company=data.get('company', '').strip(),
            message_type=data.get('type', 'other').strip(),
            message=data['message'].strip()
        )
        return JsonResponse({
            'status': 'success',
            'message_id': message.id
        })
    except Exception as e:
        return JsonResponse({
            'errors': {'server': str(e)}
        }, status=500)

def recent_messages_view(request):
    messages = Message.objects.order_by('-timestamp')[:10]
    data = {
        'messages': [
            {
                'name': msg.name,
                'email': msg.email,
                'company': msg.company,
                'message_type': msg.message_type,
                'message': msg.message,
                'timestamp': msg.timestamp.isoformat()
            }
            for msg in messages
        ]
    }
    return JsonResponse(data)

def example_view(request):
    messages = Message.objects.all()
    data = {"messages": [message.name for message in messages]}
    return JsonResponse(data)