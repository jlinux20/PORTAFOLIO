import logging
import ipaddress
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Message, Audit
import json

logger = logging.getLogger(__name__)

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
        logger.error("Invalid JSON in contact_view")
        return JsonResponse({'errors': {'body': 'Invalid JSON'}}, status=400)

    errors = {}
    required_fields = {
        'name': 'Name is required',
        'email': 'Email is required',
        'message': 'Message is required'
    }

    for field, error_message in required_fields.items():
        if not data.get(field, '').strip():
            errors[field] = error_message

    if data.get('email'):
        try:
            validate_email(data['email'])
        except ValidationError:
            errors['email'] = 'Invalid email address'

    if errors:
        logger.info(f"Validation errors in contact_view: {errors}")
        return JsonResponse({'errors': errors}, status=400)

    try:
        message = Message.objects.create(
            name=data['name'].strip(),
            email=data['email'].strip(),
            company=data.get('company', '').strip(),
            message_type=data.get('type', 'other').strip(),
            message=data['message'].strip()
        )
        logger.info(f"Message created with id {message.id}")
        return JsonResponse({
            'status': 'success',
            'message_id': message.id
        })
    except Exception as e:
        logger.error(f"Error creating message: {e}")
        return JsonResponse({
            'errors': {'server': str(e)}
        }, status=500)

def recent_messages_view(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size
        messages = Message.objects.order_by('-timestamp')[start:end]
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
            ],
            'page': page,
            'page_size': page_size
        }
        logger.info(f"Retrieved messages page {page} with size {page_size}")
        return JsonResponse(data)
    except Exception as e:
        logger.error(f"Error retrieving messages: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)

def example_view(request):
    messages = Message.objects.all()
    data = {"messages": [message.name for message in messages]}
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["POST"])
def create_audit_view(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST.dict()

        maquina = data['maquina'].strip()
        ip = data['ip'].strip()
        vulnerabilidades = data['vulnerabilidades'].strip()
        recomendaciones = data['recomendaciones'].strip()

        # Validate IP address
        try:
            ipaddress.ip_address(ip)
        except ValueError:
            logger.info(f"Invalid IP address in create_audit_view: {ip}")
            return JsonResponse({'errors': {'ip': 'Invalid IP address'}}, status=400)

        audit = Audit.objects.create(
            maquina=maquina,
            ip=ip,
            vulnerabilidades=vulnerabilidades,
            recomendaciones=recomendaciones
        )
        logger.info(f"Audit created with id {audit.id}")
        return JsonResponse({'status': 'success', 'audit_id': audit.id})
    except Exception as e:
        logger.error(f"Error creating audit: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)

def list_audits_view(request):
    try:
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size
        audits = Audit.objects.all().order_by('-timestamp')[start:end]
        data = {
            'audits': [
                {
                    'id': audit.id,
                    'maquina': audit.maquina,
                    'ip': audit.ip,
                    'vulnerabilidades': audit.vulnerabilidades,
                    'recomendaciones': audit.recomendaciones,
                    'timestamp': audit.timestamp.isoformat()
                }
                for audit in audits
            ],
            'page': page,
            'page_size': page_size
        }
        logger.info(f"Retrieved audits page {page} with size {page_size}")
        return JsonResponse(data)
    except Exception as e:
        logger.error(f"Error retrieving audits: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)

def get_audit_view(request, audit_id):
    try:
        audit = Audit.objects.get(pk=audit_id)
        data = {
            'id': audit.id,
            'maquina': audit.maquina,
            'ip': audit.ip,
            'vulnerabilidades': audit.vulnerabilidades,
            'recomendaciones': audit.recomendaciones,
            'timestamp': audit.timestamp.isoformat()
        }
        logger.info(f"Retrieved audit with id {audit_id}")
        return JsonResponse(data)
    except Audit.DoesNotExist:
        logger.info(f"Audit not found with id {audit_id}")
        return JsonResponse({'errors': {'server': 'Audit not found'}}, status=404)

@csrf_exempt
@require_http_methods(["POST", "PUT"])
def update_audit_view(request, audit_id):
    try:
        audit = Audit.objects.get(pk=audit_id)
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST.dict()

        audit.maquina = data['maquina'].strip()
        ip = data['ip'].strip()

        # Validate IP address
        try:
            ipaddress.ip_address(ip)
        except ValueError:
            logger.info(f"Invalid IP address in update_audit_view: {ip}")
            return JsonResponse({'errors': {'ip': 'Invalid IP address'}}, status=400)

        audit.ip = ip
        audit.vulnerabilidades = data['vulnerabilidades'].strip()
        audit.recomendaciones = data['recomendaciones'].strip()
        audit.save()
        logger.info(f"Updated audit with id {audit_id}")
        return JsonResponse({'status': 'success', 'audit_id': audit.id})
    except Audit.DoesNotExist:
        logger.info(f"Audit not found with id {audit_id}")
        return JsonResponse({'errors': {'server': 'Audit not found'}}, status=404)
    except Exception as e:
        logger.error(f"Error updating audit {audit_id}: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_audit_view(request, audit_id):
    try:
        audit = Audit.objects.get(pk=audit_id)
        audit.delete()
        logger.info(f"Deleted audit with id {audit_id}")
        return JsonResponse({'status': 'success'})
    except Audit.DoesNotExist:
        logger.info(f"Audit not found with id {audit_id}")
        return JsonResponse({'errors': {'server': 'Audit not found'}}, status=404)
    except Exception as e:
        logger.error(f"Error deleting audit {audit_id}: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def log_audit_action_view(request):
    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            return JsonResponse({'errors': {'body': 'Invalid content type'}}, status=415) # Unsupported Media Type

        audit_id = data.get('audit_id')
        command = data.get('command')
        arguments = data.get('arguments', '')
        output = data.get('output', '')

        if not audit_id or not command:
            return JsonResponse({'errors': {'fields': 'audit_id and command are required'}}, status=400)

        try:
            audit = Audit.objects.get(pk=audit_id)
        except Audit.DoesNotExist:
            logger.info(f"Audit not found with id {audit_id} for logging action")
            return JsonResponse({'errors': {'audit_id': 'Audit not found'}}, status=404)

        action = AuditAction.objects.create(
            audit=audit,
            command=command,
            arguments=arguments,
            output=output
        )
        logger.info(f"Audit action logged for audit {audit_id}: {command}")
        return JsonResponse({'status': 'success', 'action_id': action.id}, status=201) # Created

    except json.JSONDecodeError:
        logger.error("Invalid JSON in log_audit_action_view")
        return JsonResponse({'errors': {'body': 'Invalid JSON'}}, status=400)
    except Exception as e:
        logger.error(f"Error logging audit action: {e}")
        return JsonResponse({'errors': {'server': str(e)}}, status=500)
