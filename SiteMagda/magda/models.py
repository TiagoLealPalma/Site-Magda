from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver

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
    # Optional English name: the public site falls back to the Portuguese
    # one when empty. Descriptions stay in Portuguese on purpose.
    name_en = models.CharField(max_length=255, blank=True, default='')
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    address = models.CharField(max_length=255)
    # Optional pin for the property-page map; left blank, no map shows.
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
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
    # Lower sorts first; the first image (order, then id) is the cover shown
    # everywhere (cards, hero). Defaults to 0 for every existing row, so nothing
    # already saved changes position until someone picks a cover explicitly.
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


@receiver(post_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    # A FileField/ImageField never deletes its file on its own — not on
    # instance.delete(), and not when a Property cascades into deleting its
    # images. Without this, every deleted photo silently keeps its bytes on
    # disk forever. Django's default storage already no-ops if the file is
    # already gone, so this is safe to run unconditionally.
    if instance.image:
        instance.image.delete(save=False)
