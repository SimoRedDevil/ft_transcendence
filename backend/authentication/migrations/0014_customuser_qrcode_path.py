# Generated by Django 4.2.16 on 2024-10-15 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0013_customuser_draws_customuser_enabeld_2fa'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='qrcode_path',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
