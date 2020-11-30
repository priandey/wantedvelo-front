from django.db import models
from django.contrib.auth.models import AbstractUser
from .utils import generate_url_key


class Owner(AbstractUser):
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    username = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'phone'


class Bike(models.Model):
    owner = models.ForeignKey('Owner', on_delete=models.CASCADE, related_name="bikes")
    name = models.CharField(max_length=100, null=False, blank=False)
    robbed = models.BooleanField(default=False, null=False)
    reference = models.CharField(max_length=255, unique=True)
    bike_model = models.CharField(max_length=255)
    robbed_location = models.JSONField(null=True)


class Details(models.Model):
    bike = models.OneToOneField('Bike', on_delete=models.CASCADE, primary_key=True, verbose_name="details")
    color_major = models.CharField(max_length=255)
    color_minor = models.CharField(max_length=255)
    frame_shape = models.CharField(max_length=255)
    handlebar_shape = models.CharField(max_length=255)
    small_detail_1 = models.CharField(max_length=255)
    small_detail_2 = models.CharField(max_length=255)