from rest_framework import serializers
from .models import Owner, Bike, Details
from samaritan.serializers import FoundAlertSerializer


class OwnerSerializer(serializers.ModelSerializer):
    bikes = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Owner
        fields = ['phone', 'username', 'email', 'bikes']  # TODO : Bikes may be redundant


class BikeOwnerSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(many=False, read_only=True)
    alerts = FoundAlertSerializer(many=True, read_only=True)

    class Meta:
        model = Bike
        fields = ['name', 'picture', 'reference', 'robbed', 'robbed_location', 'pk', 'owner', 'alerts']  # TODO : owner may be redundant
