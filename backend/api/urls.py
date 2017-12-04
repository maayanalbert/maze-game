
# Here, URLs serve as the touchpoint between the backend and the front end. The 
# front end calls the main address with the given URL extension, and the back
# end receives it here and maps it to the correct view function. 

from django.conf.urls import url

from . import views

from rest_framework.authtoken import views as drf_views


urlpatterns = [
    url(r'^auth$', drf_views.obtain_auth_token, name='auth'),
    url(r'^newaccount', views.create_account),
    url(r'^password', views.start_tracking),
    url(r'^logs', views.get_logs),
    url(r'^stopTracking', views.stop_tracking),
    url(r'^checkTracking', views.check_tracking)
]
