from django.urls import path

from .views import StolenBikes

urlpatterns = [
    path('stolen-bikes/', StolenBikes.as_view())
]