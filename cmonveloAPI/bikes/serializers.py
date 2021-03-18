from rest_framework import serializers
from .models import Owner, Bike, FoundAlert, Detail


class FoundAlertSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d/%m/%y à %Hh%M", read_only=True)
    bike = serializers.HiddenField(default=0)

    class Meta:
        model = FoundAlert
        fields = ['message', 'coords', 'bike', 'date']
        read_only_fields = ['date',]


class OwnerSerializer(serializers.ModelSerializer):
    bikes = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Owner
        fields = ['username', 'email', 'bikes']


class BikeOwnerSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    details = serializers.StringRelatedField(many=True)
    alerts = FoundAlertSerializer(many=True, read_only=True)

    class Meta:
        model = Bike
        fields = ['name', 'picture', 'reference', 'details', 'robbed', 'robbed_location', 'pk', 'owner', 'alerts']
        read_only_fields = ['pk', 'owner', 'alerts']


class BikePublicSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=0)
    name = serializers.CharField(write_only=True, allow_blank=True)
    details = serializers.StringRelatedField(many=True)

    class Meta:
        model = Bike
        fields = ['name', 'picture', 'reference', 'details', 'robbed', 'robbed_location', 'pk', 'owner']
        read_only_fields = ['pk',]
