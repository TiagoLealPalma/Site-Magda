from datetime import date

from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Property
from .serializers import LeadCreateSerializer, PropertySerializer


class PropertyListAPIView(ListAPIView):
    serializer_class = PropertySerializer

    def get_queryset(self):
        properties = Property.objects.all()
        request = self.request

        search = request.GET.get('search', '')
        bedrooms = request.GET.get('bedrooms', '')
        price = request.GET.get('price', '')
        listing_type = request.GET.get('type', '')
        category = request.GET.get('category', '')

        if search:
            by_name = properties.filter(name__icontains=search)
            by_address = properties.filter(address__icontains=search)
            properties = by_name | by_address

        if listing_type in (Property.LISTING_SALE, Property.LISTING_RENT):
            properties = properties.filter(listing_type=listing_type)

        if category in dict(Property.CATEGORY_CHOICES):
            properties = properties.filter(category=category)

        if bedrooms:
            if bedrooms != '5':
                properties = properties.filter(bedrooms=int(bedrooms))
            else:
                properties = properties.filter(bedrooms__gte=5)

        if price:
            try:
                properties = properties.filter(price__lte=int(price))
            except ValueError:
                pass

        return properties


class PropertyDetailAPIView(RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    lookup_url_kwarg = 'property_id'


class SiteStatsAPIView(APIView):
    def get(self, request):
        return Response({
            'number_of_properties': Property.objects.count(),
            'properties_for_sale': Property.objects.filter(listing_type=Property.LISTING_SALE).count(),
            'properties_for_rent': Property.objects.filter(listing_type=Property.LISTING_RENT).count(),
            'years_since': date.today().year - 2015,
            'properties_sold': 250,
        })


class LeadCreateAPIView(APIView):
    def post(self, request):
        serializer = LeadCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
