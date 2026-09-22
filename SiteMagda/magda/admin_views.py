from datetime import timedelta

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, DestroyAPIView
from rest_framework.views import APIView

from django.core.files.base import ContentFile

from . import importer
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

    @action(detail=False, methods=['post'], url_path='import')
    def import_listing(self, request):
        url = (request.data.get('url') or '').strip()
        if not url:
            return Response({'detail': 'Indique um link.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            draft = importer.build_draft(url)
        except importer.ListingImportError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        return Response(draft)

    @action(detail=True, methods=['post'], url_path='images/import')
    def import_images(self, request, pk=None):
        property_obj = self.get_object()
        urls = request.data.get('urls')
        if not isinstance(urls, list) or not urls:
            return Response({'detail': 'Lista de imagens em falta.'}, status=status.HTTP_400_BAD_REQUEST)

        created, failed = [], 0
        for url in urls[:importer.MAX_IMPORTED_IMAGES]:
            try:
                content = importer.download_image(url)
            except importer.ListingImportError:
                failed += 1
                continue
            image = Image(property=property_obj)
            image.image.save(importer.image_filename(url), ContentFile(content), save=True)
            created.append(image)

        return Response(
            {'images': ImageSerializer(created, many=True, context={'request': request}).data, 'failed': failed},
            status=status.HTTP_201_CREATED,
        )


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
