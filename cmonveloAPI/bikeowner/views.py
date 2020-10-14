from django.shortcuts import render
from .models import Owner, Bike
from .serializers import OwnerSerializer, BikeOwnerSerializer

from rest_framework import generics


class OwnerList(generics.ListCreateAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer


class BikeOwnerList(generics.ListCreateAPIView):
    queryset = Bike.objects.all()
    serializer_class = BikeOwnerSerializer