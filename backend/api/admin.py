from django.contrib import admin

from .models import Game, Player, Goon, Board, Spot

# Register your models here.
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Goon)
admin.site.register(Board)
admin.site.register(Spot)