# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-08-15 15:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0002_auto_20170815_2025'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product_list',
            old_name='business_profile',
            new_name='product_description',
        ),
    ]