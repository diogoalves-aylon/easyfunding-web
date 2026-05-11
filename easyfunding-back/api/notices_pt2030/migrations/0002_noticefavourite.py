from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notices_pt2030', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='NoticeFavourite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notice_code', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='notice_favourites',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'db_table': 'portugal_2030_notice_favourites',
            },
        ),
        migrations.AddConstraint(
            model_name='noticefavourite',
            constraint=models.UniqueConstraint(
                fields=['user', 'notice_code'],
                name='unique_user_notice_favourite',
            ),
        ),
    ]
