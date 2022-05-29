from django.urls import path, include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import user_login

urlpatterns = [
        path("getinfo/", getinfo, name="settings_getinfo"),
        path("login/", user_login, name="settings_login"),
        ]
