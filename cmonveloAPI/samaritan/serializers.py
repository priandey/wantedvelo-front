from rest_framework import serializers
from bikeowner.models import Bike, Details


class BikePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['robbed', 'reference', 'bike_model', 'robbed_location', 'details']
        read_only_fields = ['robbed', 'reference', 'bike_model', 'robbed_location', 'details']
