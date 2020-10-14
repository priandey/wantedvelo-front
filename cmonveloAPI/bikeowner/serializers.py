from rest_framework import serializers
from .models import Owner, Bike, Details


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['phone', 'url_key', 'username', 'email', 'bikes']
        depth = 1
        read_only_fields = ['phone']


class BikeOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['owner', 'name', 'robbed', 'reference', 'bike_model', 'robbed_location', 'details']
        depth = 2