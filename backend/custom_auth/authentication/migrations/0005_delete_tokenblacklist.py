# Generated by Django 5.0.1 on 2024-01-30 12:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_alter_tokenblacklist_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='TokenBlacklist',
        ),
    ]