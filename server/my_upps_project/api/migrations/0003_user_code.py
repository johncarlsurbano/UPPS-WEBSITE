# Generated by Django 5.1.1 on 2024-11-16 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_street_address_alter_user_barangay_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='code',
            field=models.IntegerField(null=True),
        ),
    ]