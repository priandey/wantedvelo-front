from rest_framework import serializers
from .models import Owner, Bike, Details


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['phone', 'username', 'email', 'bikes']
        depth = 1

class BikeOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['owner', 'name', 'robbed', 'reference', 'bike_model', 'robbed_location', 'details']
        depth = 1