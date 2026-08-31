from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import admin_views, auth_views, views

admin_router = DefaultRouter()
admin_router.register('properties', admin_views.PropertyAdminViewSet, basename='admin-property')

urlpatterns = [
    path('api/properties/', views.PropertyListAPIView.as_view(), name='api_properties'),
    path('api/properties/<int:property_id>/', views.PropertyDetailAPIView.as_view(), name='api_property_detail'),
    path('api/stats/', views.SiteStatsAPIView.as_view(), name='api_stats'),
    path('api/leads/', views.LeadCreateAPIView.as_view(), name='api_leads'),

    path('api/auth/csrf/', auth_views.CsrfView.as_view(), name='api_auth_csrf'),
    path('api/auth/login/', auth_views.LoginView.as_view(), name='api_auth_login'),
    path('api/auth/logout/', auth_views.LogoutView.as_view(), name='api_auth_logout'),
    path('api/auth/me/', auth_views.MeView.as_view(), name='api_auth_me'),

    path('api/admin/', include(admin_router.urls)),
    path('api/admin/images/<int:image_id>/', admin_views.ImageAdminDeleteView.as_view(), name='api_admin_image_delete'),
    path('api/admin/leads/', admin_views.LeadAdminListView.as_view(), name='api_admin_leads'),
    path('api/admin/leads/<int:lead_id>/', admin_views.LeadAdminDeleteView.as_view(), name='api_admin_lead_delete'),
    path('api/admin/summary/', admin_views.SummaryView.as_view(), name='api_admin_summary'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
