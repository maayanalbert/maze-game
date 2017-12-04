
# Here, views serve as the functions that perform the necessary procedures in get
# and post requests.

from django.conf import settings
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.views import generic
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import HttpResponse

from .models import Profile, Log
from django.contrib.auth.models import User

import time
from datetime import date

# Take a username, password, and email and use it to create a new account.
@api_view(['GET','POST'])
def create_account(request):

    # get data
    newUserInfo = request.data

    # create a new user
    user = User.objects.create_user(username = newUserInfo['newUsername'], 
        password = newUserInfo['newPassword'])
    user.save()

    # get the correct profile
    userID = user.id
    profile = Profile.objects.get(user_id = userID)

    # update facebook_email
    profile.facebook_email = newUserInfo['newFacebookEmail']
    profile.save()

    return Response({'Account has been added'})


# Start tracking the user's friends
@api_view(['GET','POST'])
def start_tracking(request):

    # get data
    info = request.data
    username = info['username']
    fbpassword = info['fbpassword']

    # get the correct profile
    user = User.objects.get(username = username)
    userID = user.id
    profile = Profile.objects.get(user_id = userID)

    # store the day of the week in which the tracking began and set tracking
    # to be true
    profile.start_day = date.weekday(date.today())
    profile.tracking = True
    profile.save()

    # Run the scraper. To avoid security controls, pass the facebook password
    # directly into the function.
    profile.runScraper(fbpassword)
    return Response({'Started Tracking'})

# Get all of the logs associated with that user and send it back to the frontend.
@api_view(['GET','POST'])
def get_logs(request):

    # get data
    info = request.data
    username = info['username']

    # get the correct profile
    user = User.objects.get(username = username)
    userID = user.id
    profile = Profile.objects.get(user_id = userID)

    # convert the logs to a tuple so that it can be sent back to the frontend
    allLogs = profile.log_set.all()
    output = []
    for currentLog in allLogs:
        currentLogTime = currentLog.log_time
        currentLogFriends = currentLog.friends_online
        output.append((currentLogTime, currentLogFriends))
    output = tuple(output)

    return Response({'logs': output, 'startDay': profile.start_day})

# set tracking to false
@api_view(['GET','POST'])
def stop_tracking(request):

    # get data
    info = request.data
    username = info['username']

    # get the correct profile
    user = User.objects.get(username = username)
    userID = user.id
    profile = Profile.objects.get(user_id = userID)

    # set stracking to false
    profile.tracking = False
    profile.save()

    return Response({'username': username})


# check if we are currently tracking friend data
@api_view(['GET','POST'])
def check_tracking(request):

    # get data
    info = request.data
    username = info['username']

    # get the correct profile
    user = User.objects.get(username = username)
    userID = user.id
    profile = Profile.objects.get(user_id = userID)

    # get the value of tracking
    isTracking = profile.tracking

    return Response({isTracking})


