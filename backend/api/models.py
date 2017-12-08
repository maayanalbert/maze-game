
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

# from django.db import models
# from django.contrib.postgres.fields import ArrayField

# class Game(models.Model):
#     board = ArrayField(
#         ArrayField(
#             models.IntegerField(default = 1),
#             size=8,
#         ),
#         size=8,
#     )
#     player_postion = ArrayField(models.IntegerField(default = 1),
#             size=2,
#         )
#     player_direction = models.IntegerField(default = 0)







