# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-08 19:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_player'),
    ]

    operations = [
        migrations.CreateModel(
            name='Goon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('xPos', models.IntegerField(default=0)),
                ('yPos', models.IntegerField(default=0)),
                ('game', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.Game')),
            ],
        ),
    ]
