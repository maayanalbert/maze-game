
# database models

from django.db import models
from django.utils.encoding import python_2_unicode_compatible

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db.models.signals import post_save
from django.dispatch import receiver

import csv
import getpass
import os
import time

from datetime import datetime
from selenium import webdriver

# Django comes with built in user models. However, the information you can store
# in them is limited. To add more information, I created a profile model that
# updates with the user model and contains additional relevant properties.


# Profile model
class Dot(models.Model):
    redColor = models.IntegerField(default=0)

class Game(models.Model):
    playing = models.BooleanField(default=True)
    over = models.BooleanField(default=False)
    boardTemplateNum = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    def __str__(self):
        return str(self.id)

class Board(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, default=None)
    numRows = models.IntegerField(default=0)
    numCols = models.IntegerField(default=0) 
    beingSet = models.BooleanField(default=False)

class Spot(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=None)
    xPos = models.IntegerField(default=0)
    yPos = models.IntegerField(default=0)
    filled = models.BooleanField(default=False)

class Player(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, default=None) 
    xPos = models.IntegerField(default=0)
    yPos = models.IntegerField(default=0)
    direction = models.IntegerField(default=0)

class Goon(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, default=None) 
    xPos = models.IntegerField(default=0)
    yPos = models.IntegerField(default=0) 





