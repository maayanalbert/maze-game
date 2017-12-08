
# Here, views serve as the functions that perform the necessary procedures in get
# and post requests.

from django.conf import settings
from django.shortcuts import render, redirect
from django.views import generic
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import HttpResponse

from .models import Dot

import time
from datetime import date

# Take a username, password, and email and use it to create a new account.
@api_view(['GET','POST'])
def make_redder(request):
    
    d = Dot.objects.get(id = 1)
    
    d.redColor += 10
    d.save()

    return Response({d.redColor})

@api_view(['GET','POST'])
def get_red(request):
    
    d = Dot.objects.get(id = 1)

    return Response({d.redColor})

@api_view(['GET','POST'])
def make_less_red(request):
    d = Dot.objects.get(id = 1)
    
    d.redColor -= 10
    d.save()

    return Response({d.redColor})

# @api_view(['GET','POST'])
# def make_new_game(request):
#     g = Game()
#     game.save()

#     return Response({'board' : g.board, 'position': g.player_postion,
#         'direction' : g.player_direction})

