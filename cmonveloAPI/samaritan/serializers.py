from rest_framework import serializers
from bikeowner.models import Bike, Details


class BikePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['robbed', 'reference', 'robbed_location', 'details', 'picture']
        read_only_fields = ['robbed', 'reference', 'robbed_location', 'details', 'picture']
