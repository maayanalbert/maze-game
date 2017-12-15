# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-29 16:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20171128_0209'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='start_day',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='profile',
            name='interval_time',
            field=models.IntegerField(default=300),
        ),
        migrations.AlterField(
            model_name='profile',
            name='total_time',
            field=models.IntegerField(default=302400),
        ),
    ]
