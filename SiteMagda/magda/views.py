from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from .forms import PropertyForm, ImageUploadForm
from .models import Image, Property

def property_detail(request, property_id):
    property = get_object_or_404(Property, id=property_id)
    return render(request, 'magda/property_detail.html', {'property': property})

def create_property(request):
    if request.method == 'POST':
        form = PropertyForm(request.POST)
        images_form = ImageUploadForm(request.POST, request.FILES)

        if form.is_valid() and images_form.is_valid():
            property = form.save()

            for image in request.FILES.getlist('images'):
                Image.objects.create(property=property, image=image)

            return redirect('property_success')
    else:
        form = PropertyForm()
        images_form = ImageUploadForm()

    return render(request, 'magda/create_property.html', {
        'form': form,
        'images_form': images_form
    })

def load_landing_page(request):
    top6_properties = Property.objects.all()[:6]
    return render(request, "magda/home.html", {
        "properties": top6_properties})

def load_for_sale(request):
    propriedades = Property.objects.all()
    return render(request, 'magda/forSale.html', {'propriedades': propriedades})

def create_property_confirmation(request):
    template = loader.get_template('magda/property_success_confirmation.html')
    return HttpResponse(template.render())