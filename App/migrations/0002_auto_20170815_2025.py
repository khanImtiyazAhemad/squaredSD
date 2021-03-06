# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-15 14:55
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product_List',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(max_length=50, verbose_name='Product Name')),
                ('business_profile', models.TextField(blank=True, max_length=2000, verbose_name='Profile')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created_at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='updated_at')),
            ],
            options={
                'verbose_name_plural': 'Fido Products',
            },
        ),
        migrations.AlterModelOptions(
            name='myuser',
            options={'verbose_name_plural': 'Fido Users'},
        ),
        migrations.AddField(
            model_name='product_list',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
