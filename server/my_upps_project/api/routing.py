from django.urls import re_path
from .consumers import MyConsumer

websocket_urlpatterns = [
    re_path(r'ws/queue_updates/', MyConsumer.as_asgi()),
]