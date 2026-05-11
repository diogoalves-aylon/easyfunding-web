from django.db import models
from django.contrib.auth.models import Group
from django.contrib.auth.models import AbstractUser

class RoutePermission(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='route_permissions')
    route_name = models.CharField(max_length=255)

    class Meta:
        unique_together = ('group', 'route_name')

    def __str__(self):
        return f"{self.group.name} - {self.route_name}"

class ComponentPermission(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='component_permissions')
    component_key = models.CharField(max_length=255)

    class Meta:
        unique_together = ('group', 'component_key')

    def __str__(self):
        return f"{self.group.name} - {self.component_key}"


class GroupProfile(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='profile')
    description = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f"{self.group.name} profile"


class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    