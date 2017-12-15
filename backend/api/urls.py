
# Here, URLs serve as the touchpoint between the backend and the front end. The 
# front end calls the main address with the given URL extension, and the back
# end receives it here and maps it to the correct view function. 

from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^redder', views.make_redder),
    url(r'^lessred', views.make_less_red),
    url(r'^red', views.get_red),
    url(r'^newgame', views.make_new_game),
    url(r'^getgame', views.get_game),
    url(r'^nochanges', views.get_game_no_changes),
    url(r'^move', views.move_player),
    url(r'^goons', views.move_goons),
]
