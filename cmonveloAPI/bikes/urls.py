from django.urls import path
from .views import RobbedBikes, BikeDetail, FoundBike

urlpatterns = [
    path("", RobbedBikes.as_view(), name="robbed_bikes"),
    path("bike/<int:pk>/", BikeDetail.as_view(), name="bike_detail"),
    path("bike/<int:pk>/found/", FoundBike.as_view(), name="bike_found"),
]