from rest_framework import serializers
from .models import Owner, Bike, FoundAlert, Detail


class FoundAlertSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d/%m/%y à %Hh%M", read_only=True)

    class Meta:
        model = FoundAlert
        fields = ['message', 'coords', 'bike', 'date']
        read_only_fields = ['date',]


class OwnerSerializer(serializers.ModelSerializer):
    bikes = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Owner
        fields = ['username', 'email', 'bikes']


class BikeSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    detail = serializers.StringRelatedField()
    alerts = FoundAlertSerializer(many=True, read_only=True)

    class Meta:
        model = Bike
        fields = ['name', 'picture', 'reference', 'detail', 'robbed', 'robbed_location', 'pk', 'owner', 'alerts']
