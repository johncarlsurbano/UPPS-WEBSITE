# Generated by Django 5.1.1 on 2024-11-24 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_bookbindrequesttype_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='laminationrequesttype',
            name='price',
            field=models.IntegerField(default=5),
            preserve_default=False,
        ),
    ]
