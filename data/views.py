from django.shortcuts import render, redirect
from geolib import geohash
from django.http import JsonResponse
import requests, json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(["POST"])
def event_search(request):
    data = json.loads(request.body)
    keyword = data.get("keyword")
    segmentID = data.get("segmentID")
    radius = data.get("radius")
    lat = float(data.get("lat"))
    long = float(data.get("long"))

    geocode = geohash.encode(lat, long, 7)

    baseURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=apikey&keyword={}&segmentId={}&radius={}&unit=miles&geoPoint={}".format(
    keyword, segmentID, radius, geocode)
    response = requests.get(baseURL).json()

    return JsonResponse({"data":response})

@csrf_exempt
def home(request, data=None):
    return JsonResponse({'data': data})
