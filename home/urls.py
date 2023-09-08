from django.contrib import admin
from django.urls import path
from home import views
urlpatterns = [
    path("login/",views.log),
    path("register/",views.register),
    path("",views.index),
    path("logout/",views.signup),
    path("save_container/",views.save_logs),
    path("save_profiles/",views.save_profile),
    path("<str:room_name>/",views.group)
]
