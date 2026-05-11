from django.conf import settings
from django.db import models


class Portugal2030Notice(models.Model):
    domination = models.TextField()
    classification = models.CharField(max_length=255)
    code = models.CharField(max_length=100)
    fund = models.CharField(max_length=255)
    notice_publication_date = models.DateTimeField()
    notice_start_date = models.DateTimeField()
    notice_end_date = models.DateTimeField()
    notice_updated_at = models.DateTimeField()
    global_allocation = models.DecimalField(decimal_places=2, max_digits=100)
    national_allocation = models.DecimalField(decimal_places=2, max_digits=100, blank=True)
    total_allocation = models.DecimalField(decimal_places=2, max_digits=100)
    documents = models.TextField(blank=True)
    type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'portugal_2030_notices'
        indexes = [
            models.Index(fields=['code', 'type'], name='port2030_code_type_idx'),
        ]


class NoticeFavourite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notice_favourites',
    )
    notice_code = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'portugal_2030_notice_favourites'
        constraints = [
            models.UniqueConstraint(fields=['user', 'notice_code'], name='unique_user_notice_favourite'),
        ]