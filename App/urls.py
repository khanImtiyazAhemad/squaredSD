from django.conf.urls import url
from django.conf import settings
# from django.conf.urls.static import static
from .views import *



# ******* WEBSITE URL ********
urlpatterns = [
	url(r'^$', landingpage), 
	url(r'^signup$', SignupView.as_view(),name='signup'),
	url(r'^login$', LoginView.as_view(),name='login'),
	url(r'^productList$', ProductlistView.as_view(),name='productList'),
	url(r'^createProduct$', CreateproductView.as_view(),name='createProduct'),
]


