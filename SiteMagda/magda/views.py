from datetime import date

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from .forms import PropertyForm, ImageUploadForm
from .models import Image, Property, Lead

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

    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        Lead.objects.create(name=name, email=email, message=message)
        return redirect('property_success')


    top6_properties = Property.objects.all()[:6]
    years_since = date.today().year - 2015
    number_of_properties = Property.objects.count()

    return render(request, "magda/home.html", {
        "properties": top6_properties,
        "years_since": years_since,
        "number_of_properties": number_of_properties
    })

def load_for_sale(request):
    properties = Property.objects.all()

    # Get URL parameters
    search = request.GET.get('search', "")
    tipologia = request.GET.get('type', '')
    preco = request.GET.get('price', '')

    # Filter accordingly

    # Search filtering
    if search != "":
        by_name = properties.filter(name__icontains=search)
        by_address = properties.filter(address__icontains=search)

        properties = by_name | by_address

    # Type
    if tipologia != "":
        if tipologia != "5":
            properties = properties.filter(bedrooms=int(tipologia))
        else:
            properties = properties.filter(bedrooms__gte=5)

    # Price
    if preco != "":
        try:
            price = int(preco)
            properties = properties.filter(price__lte=int(price))
        except ValueError:
            pass



    return render(request, 'magda/forSale.html', {'propriedades': properties,
                                                  "tipologia": tipologia,
                                                  "preco": preco,
                                                  "search": search,
                                                  })





def create_property_confirmation(request):
    template = loader.get_template('magda/property_success_confirmation.html')
    return HttpResponse(template.render())


def load_brevemente_page(request):
    return render(request, 'magda/brevemente.html')