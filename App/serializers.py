from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField
from .models import *


class UserSerializer(serializers.ModelSerializer):
    """docstring for UserSerializer"""
    password = serializers.CharField(write_only=True, min_length=8, error_messages={"blank": "Password cannot be empty.", "min_length": "Password too short.",})
    class Meta:
        """Doc string for class Meta"""
        model = MyUser
        fields = "__all__"

class ProductListSerializer(serializers.ModelSerializer):
	"""docstring for ClassName"""

	user = SerializerMethodField()
	def get_user(self, obj):
		return obj.user.email

	class Meta:
		"""Doc string for class Meta"""
		model = Product_List
		exclude = ('created_at','updated_at',)
	
class ProductSerializer(serializers.ModelSerializer):
	"""docstring for ClassName"""

	class Meta:
		"""Doc string for class Meta"""
		model = Product_List
		fields = "__all__"		