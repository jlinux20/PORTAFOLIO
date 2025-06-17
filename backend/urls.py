from django.contrib import admin
from django.urls import path
from backend.core.views import example_view, index_view, contact_view, recent_messages_view, create_audit_view, list_audits_view, get_audit_view, update_audit_view, delete_audit_view
from django.conf import settings
from django.conf.urls.static import static

# Placeholder views for contact and recent_messages to be implemented

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_view, name='index'),
    path('example/', example_view, name='example'),
    path('contact/', contact_view, name='contact'),
    path('recent_messages/', recent_messages_view, name='recent_messages'),
    path('audits/create/', create_audit_view, name='create_audit'),
    path('audits/list/', list_audits_view, name='list_audits'),
    path('audits/<int:audit_id>/', get_audit_view, name='get_audit'),
    path('audits/<int:audit_id>/update/', update_audit_view, name='update_audit'),
    path('audits/<int:audit_id>/delete/', delete_audit_view, name='delete_audit'),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
