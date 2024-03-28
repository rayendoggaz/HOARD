# Generated by Django 5.0.1 on 2024-02-01 14:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('folder_backend', '0007_remove_file_user_folder_user'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='folder_files', to=settings.AUTH_USER_MODEL),
        ),
    ]
