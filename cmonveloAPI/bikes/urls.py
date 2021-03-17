from django.urls import path
from .views import RobbedBikes

urlpatterns = [
    path("", RobbedBikes.as_view(), name="robbed_bikes")
]