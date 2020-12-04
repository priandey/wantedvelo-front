from bikeowner.models import Bike
from .serializers import BikePublicSerializer
from rest_framework import generics


class StolenBikes(generics.ListAPIView):
    """
    Expect coordinates lon and lat in query params
    """
    queryset = Bike.objects.filter(robbed=True)
    serializer_class = BikePublicSerializer
