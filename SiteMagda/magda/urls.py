from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.load_landing_page, name='home'),
    path('properties', views.load_for_sale, name='forsale'),
    path('properties/new/', views.create_property, name='create_property_notbeingused'),
    path('properties/', views.create_property_confirmation, name='property_success'),
    path('property/<int:property_id>/', views.property_detail, name='property_detail')
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)