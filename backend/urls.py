from django.contrib import admin
from django.urls import path
from backend.core.views import example_view, index_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index_view, name='index'),
    path('example/', example_view, name='example'),
]

from django.conf.urls.static import static
from django.conf import settings

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'src' / 'styles')
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / 'src' / 'scripts')
