# Generated by Django 5.1.1 on 2025-02-12 01:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_workinprocessinventory_inventory_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stockcard',
            name='printing_inventory',
        ),
    ]
