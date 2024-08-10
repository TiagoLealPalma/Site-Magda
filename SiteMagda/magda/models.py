from django.db import models

# Create your models here.

class Property(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    bedrooms = models.IntegerField()
    typology = models.TextField()
    area = models.IntegerField()
    liquid_area = models.IntegerField(null=True, blank=True)
    construction_date = models.IntegerField(null=True, blank=True)

class Lead(models.Model):
    name = models.CharField(max_length=255,)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    message = models.TextField()

class Image(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)



