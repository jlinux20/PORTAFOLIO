# Generated by Django 5.2.1 on 2025-06-29 16:01

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('command', models.CharField(max_length=255)),
                ('arguments', models.TextField(blank=True)),
                ('output', models.TextField(blank=True)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('audit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='actions', to='core.audit')),
            ],
            options={
                'ordering': ['timestamp'],
            },
        ),
    ]
