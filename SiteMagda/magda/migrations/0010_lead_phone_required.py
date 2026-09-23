from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('magda', '0009_area_decimal_and_english_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='phone',
            field=models.CharField(max_length=255),
        ),
    ]
