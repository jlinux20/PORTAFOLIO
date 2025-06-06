from django.contrib import admin
from django.urls import path
from backend.core.views import example_view, index_view
from django.conf import settings
from django.conf.urls.static import static

# Placeholder views for contact and recent_messages to be implemented
from django.http import JsonResponse

def contact_view(request):
    if request.method == 'POST':
        # Placeholder response for contact form submission
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid method'}, status=405)

def recent_messages_view(request):
    # Placeholder response for recent messages
    return JsonResponse({'messages': []})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_view, name='index'),
    path('example/', example_view, name='example'),
    path('contact/', contact_view, name='contact'),
    path('recent_messages/', recent_messages_view, name='recent_messages'),
]

from django.conf.urls.static import static
from django.conf import settings

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
