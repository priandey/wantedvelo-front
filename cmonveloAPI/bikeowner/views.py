from .models import Owner, Bike
from .serializers import OwnerSerializer, BikeOwnerSerializer
from .permissions import IsUser

from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import authentication, permissions


class UserListView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsUser]
    authentication_classes = [authentication.TokenAuthentication,]
    serializer_class = OwnerSerializer

    def get_object(self):
        user = self.request.user.pk
        return get_object_or_404(Owner, pk=user)


class BikeOwnerList(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = BikeOwnerSerializer

    def get_queryset(self):
        user = self.request.user
        bikes = Bike.objects.filter(owner=user)
        return bikes

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)