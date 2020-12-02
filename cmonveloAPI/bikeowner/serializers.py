from rest_framework import serializers
from .models import Owner, Bike, Details


class OwnerSerializer(serializers.ModelSerializer):
    bikes = serializers.StringRelatedField(many=True)
    class Meta:
        model = Owner
        fields = ['phone', 'username', 'email', 'bikes']

class BikeOwnerSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(many=False, read_only=True)

    class Meta:
        model = Bike
        fields = ['owner', 'name', 'robbed', 'reference', 'bike_model', 'robbed_location', 'details', 'pk']