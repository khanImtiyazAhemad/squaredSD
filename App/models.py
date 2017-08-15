from django.db import models
from django.conf import settings
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from googleapiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage

# Create your models here.
class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email, and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        Token.objects.create(user=user)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password
        )
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class MyUser(AbstractBaseUser, PermissionsMixin):
    """
    User Table for Avaana
    """
    email = models.EmailField(('email address'), max_length=255, unique=True)
    full_name = models.CharField(('First name'), max_length=50, blank=False)
    is_active = models.BooleanField(_('Active'), default=True)
    is_admin = models.BooleanField(_('Admin'), default=False)
    is_staff = models.BooleanField(_('Staff'), default=False)
    created_at = models.DateTimeField(('created_at'), auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(('updated_at'), auto_now=True, auto_now_add=False)
    objects = MyUserManager()
    USERNAME_FIELD = 'email'


    def get_full_name(self):
        # The user is identified by their email address
        return self.full_name

    def __str__(self):
        return self.email

    class Meta:
        """
        Meta Class to show Desired name of Table in Admin.py
        """
        verbose_name_plural = 'Fido Users'

class Product_List(models.Model):
    """
    Business Detail of Avaana Sponsered Business (Step 2 of List your Business)
    """
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="product_user")
    product_name = models.CharField(_('Product Name'), max_length=50,blank=False)
    product_description = models.TextField(_('Profile'), max_length=2000, blank=True)
    created_at = models.DateTimeField(_('created_at'), auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(_('updated_at'), auto_now=True, auto_now_add=False)

    class Meta:
        """
        Meta Class to show Desired name of Table in Admin.py
        """
        verbose_name_plural = 'Fido Products'