from .models import Owner, Bike
from .serializers import OwnerSerializer, BikeOwnerSerializer

from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics


class OwnerList(generics.ListCreateAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer


class BikeOwnerList(generics.ListCreateAPIView):
    serializer_class = BikeOwnerSerializer

    def get_queryset(self):
        try:
            user = Owner.objects.get(url_key=self.request.GET['u'])
            bikes = Bike.objects.filter(owner=user)
        except ObjectDoesNotExist:
            bikes = Bike.objects.none()
        except KeyError:
            bikes = Bike.objects.none()
        return bikes

