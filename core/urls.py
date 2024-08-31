from django.contrib import admin
from django.urls import path, include
from data import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home,name="home"),
    path('search/', views.event_search, name="event")
]
