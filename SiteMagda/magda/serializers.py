from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from rest_framework import serializers

from .models import Image, Lead, Property


class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'url']

    def get_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class PropertySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'name_en', 'listing_type', 'category', 'price', 'description', 'description_en', 'address',
            'latitude', 'longitude',
            'bedrooms', 'bathrooms', 'typology', 'area',
            'liquid_area', 'construction_date', 'status', 'featured', 'images',
        ]


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['name', 'email', 'phone', 'message']


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']


# Field -> decimal places its model column actually keeps. DecimalField's own
# validation rejects a value with more places than that outright ("Ensure
# there are no more than N decimal places") instead of rounding it, which
# turns "someone typed one extra digit" into a hard save failure. Rounding
# here first — before DRF ever sees the raw value — is the sanitizing step.
_DECIMAL_PRECISION = {'price': 2, 'area': 1, 'liquid_area': 1}


def _round_decimal_inputs(data):
    for field, places in _DECIMAL_PRECISION.items():
        value = data.get(field)
        if value in (None, ''):
            continue
        try:
            quant = Decimal(1).scaleb(-places)
            data[field] = str(Decimal(str(value)).quantize(quant, rounding=ROUND_HALF_UP))
        except (InvalidOperation, ValueError, TypeError):
            pass  # not parseable as a number at all — let the field's own validation report it
    return data


class PropertyWriteSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'name_en', 'listing_type', 'category', 'price', 'description', 'description_en', 'address',
            'latitude', 'longitude',
            'bedrooms', 'bathrooms', 'typology', 'area',
            'liquid_area', 'construction_date', 'status', 'featured', 'images',
        ]

    def to_internal_value(self, data):
        data = _round_decimal_inputs(dict(data))
        return super().to_internal_value(data)


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'property', 'image']
