from rest_framework import routers
from .views import BikeViewset

router = routers.SimpleRouter()
router.register(r'bike', BikeViewset)

urlpatterns = router.urls