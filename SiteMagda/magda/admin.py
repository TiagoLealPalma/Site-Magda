from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Property, Lead, Image

# Mostrar imagens inline na propriedade
class ImageInline(admin.TabularInline):
    model = Image
    extra = 1  # Quantas imagens extra aparecem para adicionar

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'bedrooms', 'area')
    inlines = [ImageInline]

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('property', 'image')
