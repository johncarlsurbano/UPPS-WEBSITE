# Generated by Django 5.1.1 on 2025-02-26 05:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_workinprocessfifo_transferred_count_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LaminationFilmSize',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lamination_film_size', models.CharField(max_length=100)),
            ],
        ),
    ]
