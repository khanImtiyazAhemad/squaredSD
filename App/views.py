from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.permissions import (AllowAny, IsAuthenticated)
from rest_framework_jwt.utils import jwt_payload_handler

import jwt
from .models import *
from .serializers import *

##########################
@permission_classes((AllowAny,))
def landingpage(request):
    return render(request, 'index.html')

class SignupView(APIView):
	"""docstring for SignupView"""
	permission_classes = (permissions.AllowAny,)
	def post(self, request, format=None):
		print(request.data)
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			result = serializer.save()
			payload = jwt_payload_handler(result)
			token = jwt.encode(payload, settings.SECRET_KEY)
			auth_token = token.decode('unicode_escape')
			return Response({"userData":serializer.data,'token':auth_token}, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.CreateAPIView):
	"""docstring for LoginView"""
	serializer_class = 	UserSerializer
	queryset = MyUser.objects.all()
	permission_classes = (permissions.AllowAny,)
	def create(self, request, format=None):
		user = get_user_model().objects.get(email=request.data['email'].lower(),password=request.data['password'])
		serializer = UserSerializer(user)
		if user:
			payload = jwt_payload_handler(user)
			token = jwt.encode(payload, settings.SECRET_KEY)
			auth_token = token.decode('unicode_escape')
			return Response({"userData":serializer.data,'token':auth_token}, status = status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)
	

class ProductlistView(generics.ListCreateAPIView):
	"""docstring for ProductlistView"""
	queryset = Product_List.objects.all()
	serializer_class = ProductListSerializer
	permission_classes = (permissions.AllowAny,)

	def list(self, request):
		queryset = self.get_queryset()
		serializer = ProductListSerializer(queryset, many=True)
		return Response(serializer.data,status=status.HTTP_200_OK)
	
		
class CreateproductView(generics.CreateAPIView):
	"""docstring for CreateproductView"""

	queryset = Product_List.objects.all()
	serializer_class = ProductSerializer
	permission_classes = (permissions.IsAuthenticated,)

	def create(self, request):
		params = request.data
		params['user'] = request.user.id
		serializer = ProductSerializer(data=params)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data,status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



	
		

	
		