# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-25 18:07
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='Facebook_account',
        ),
    ]
