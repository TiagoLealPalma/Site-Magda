from django.db import models

# Create your models here.

class Property(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_COMING_SOON = 'coming_soon'
    STATUS_RESERVED = 'reserved'
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Disponível'),
        (STATUS_COMING_SOON, 'Brevemente'),
        (STATUS_RESERVED, 'Reservado'),
    ]

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.IntegerField(null=True, blank=True)
    typology = models.TextField()
    area = models.IntegerField()
    liquid_area = models.IntegerField(null=True, blank=True)
    construction_date = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)

class Lead(models.Model):
    name = models.CharField(max_length=255,)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)

class Image(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='property_images/')



