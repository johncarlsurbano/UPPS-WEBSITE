# Generated by Django 5.1.1 on 2025-02-19 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_workinprocessinventory_sheets_per_ream'),
    ]

    operations = [
        migrations.AddField(
            model_name='workinprocessfifo',
            name='sheets_per_ream',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
