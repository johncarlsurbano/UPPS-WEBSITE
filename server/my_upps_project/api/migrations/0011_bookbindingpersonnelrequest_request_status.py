# Generated by Django 5.1.1 on 2024-11-25 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_paymentslip_lamination_request'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookbindingpersonnelrequest',
            name='request_status',
            field=models.CharField(default='pending', max_length=10),
        ),
    ]
