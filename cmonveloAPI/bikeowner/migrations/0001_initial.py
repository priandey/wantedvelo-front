# Generated by Django 3.1.2 on 2020-10-14 09:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bike',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('robbed', models.BooleanField(default=False)),
                ('reference', models.CharField(max_length=255, unique=True)),
                ('bike_model', models.CharField(max_length=255)),
                ('robbed_location', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('phone', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('url_key', models.CharField(max_length=255, unique=True)),
                ('username', models.CharField(max_length=80)),
                ('email', models.EmailField(max_length=254, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Details',
            fields=[
                ('bike', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='bikeowner.bike')),
                ('color_major', models.CharField(max_length=255)),
                ('color_minor', models.CharField(max_length=255)),
                ('frame_shape', models.CharField(max_length=255)),
                ('handlebar_shape', models.CharField(max_length=255)),
                ('small_detail_1', models.CharField(max_length=255)),
                ('small_detail_2', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='bike',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bikeowner.owner', verbose_name='bikes'),
        ),
    ]
