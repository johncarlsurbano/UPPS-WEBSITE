# Generated by Django 5.1.1 on 2024-11-26 07:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_remove_bill_request_type_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bill',
            name='type',
            field=models.CharField(default=1, max_length=10),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='JobOrder',
        ),
    ]
