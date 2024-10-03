from django.urls import path
from .views import getUser,createUser

urlpatterns = [
    path('getuser/', getUser, name="getUser"),
    path('createuser/',createUser, name="createUser")
]