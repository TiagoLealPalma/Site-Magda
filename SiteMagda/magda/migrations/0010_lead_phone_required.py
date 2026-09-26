from django.db import migrations, models


def fill_null_phones(apps, schema_editor):
    Lead = apps.get_model('magda', 'Lead')
    Lead.objects.filter(phone__isnull=True).update(phone='')


class Migration(migrations.Migration):

    dependencies = [
        ('magda', '0009_area_decimal_and_english_description'),
    ]

    operations = [
        migrations.RunPython(fill_null_phones, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='lead',
            name='phone',
            field=models.CharField(max_length=255),
        ),
    ]
