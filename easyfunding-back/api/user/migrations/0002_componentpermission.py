from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('api_user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComponentPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('component_key', models.CharField(max_length=255)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='component_permissions', to='auth.group')),
            ],
            options={
                'unique_together': {('group', 'component_key')},
            },
        ),
    ]
