from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('contact/', views.contact_view, name='contact'),
    path('messages/recent/', views.recent_messages_view, name='recent_messages'),
    path('example/', views.example_view, name='example'),
    path('audit/create/', views.create_audit_view, name='create_audit'),
    path('audit/list/', views.list_audits_view, name='list_audits'),
    path('audit/<int:audit_id>/', views.get_audit_view, name='get_audit'),
    path('audit/<int:audit_id>/update/', views.update_audit_view, name='update_audit'),
    path('audit/<int:audit_id>/delete/', views.delete_audit_view, name='delete_audit'),
    # Nueva URL para registrar acciones de auditoría
    path('audit/action/', views.log_audit_action_view, name='log_audit_action'),
]