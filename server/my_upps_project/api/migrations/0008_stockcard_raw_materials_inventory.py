# Generated by Django 5.1.1 on 2025-02-12 01:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_stockcard_printing_inventory'),
    ]

    operations = [
        migrations.AddField(
            model_name='stockcard',
            name='raw_materials_inventory',
            field=models.ForeignKey(default=13, on_delete=django.db.models.deletion.CASCADE, to='api.rawmaterialsinventory'),
            preserve_default=False,
        ),
    ]
