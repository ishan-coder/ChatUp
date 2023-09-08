from django.urls import re_path
from django.urls import path
from home import consumers
websocket_urlpatterns = [
    re_path(r'(?P<room_name>[^/]+)/$', consumers.chatConsumer.as_asgi()),
]
