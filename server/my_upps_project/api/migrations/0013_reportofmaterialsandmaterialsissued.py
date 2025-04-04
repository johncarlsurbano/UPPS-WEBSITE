# Generated by Django 5.1.1 on 2025-02-13 01:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_remove_workinprocessfifo_inventory_item_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReportOfMaterialsAndMaterialsIssued',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('responsibility_center_code', models.IntegerField(blank=True, null=True)),
                ('stock_number', models.IntegerField(blank=True, null=True)),
                ('item', models.CharField(blank=True, max_length=255, null=True)),
                ('unit', models.CharField(blank=True, max_length=50, null=True)),
                ('unit_cost', models.IntegerField(blank=True, null=True)),
                ('amount', models.IntegerField(blank=True, null=True)),
                ('or_number', models.IntegerField(blank=True, null=True)),
                ('raw_materials_inventory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.rawmaterialsinventory')),
            ],
        ),
    ]
