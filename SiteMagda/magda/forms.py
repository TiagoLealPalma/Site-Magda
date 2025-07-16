# forms.py
from django import forms
from .models import Property, Image
from django.forms.models import inlineformset_factory

class PropertyForm(forms.ModelForm):
    class Meta:
        model = Property
        fields = '__all__'

# NÃO definir widget diretamente aqui
class ImageUploadForm(forms.Form):
    images = forms.FileField(required=False)


