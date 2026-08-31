from datetime import timedelta

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, DestroyAPIView
from rest_framework.views import APIView

from .models import Image, Lead, Property
from .serializers import ImageSerializer, LeadSerializer, PropertyWriteSerializer


class IsStaffUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_staff


class PropertyAdminViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-id')
    serializer_class = PropertyWriteSerializer
    permission_classes = [IsStaffUser]

    @action(detail=True, methods=['post'], url_path='images')
    def upload_image(self, request, pk=None):
        property_obj = self.get_object()
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'detail': 'Ficheiro "image" em falta.'}, status=status.HTTP_400_BAD_REQUEST)

        image = Image.objects.create(property=property_obj, image=image_file)
        return Response(ImageSerializer(image, context={'request': request}).data, status=status.HTTP_201_CREATED)


class ImageAdminDeleteView(DestroyAPIView):
    queryset = Image.objects.all()
    permission_classes = [IsStaffUser]
    lookup_url_kwarg = 'image_id'


class LeadAdminListView(ListAPIView):
    queryset = Lead.objects.all().order_by('-created_at')
    serializer_class = LeadSerializer
    permission_classes = [IsStaffUser]


class LeadAdminDeleteView(DestroyAPIView):
    queryset = Lead.objects.all()
    permission_classes = [IsStaffUser]
    lookup_url_kwarg = 'lead_id'


class SummaryView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        week_ago = timezone.now() - timedelta(days=7)
        return Response({
            'properties_count': Property.objects.count(),
            'leads_count': Lead.objects.count(),
            'leads_last_7_days': Lead.objects.filter(created_at__gte=week_ago).count(),
        })
