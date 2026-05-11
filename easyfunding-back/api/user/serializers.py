from django.contrib.auth.models import  Group
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import RoutePermission, ComponentPermission, GroupProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    is_admin = serializers.BooleanField(source='is_staff')
    role = serializers.SerializerMethodField()

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_admin', 'role', 'phone')

    def get_role(self, obj):
        group = obj.groups.first()
        return group.name if group else ('ADMIN' if obj.is_staff else 'USER')


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            phone=validated_data.get('phone', None),
        )

        # Sync is_staff with ADMIN group
        if validated_data.get('is_staff'):
            group, _ = Group.objects.get_or_create(name='ADMIN')
            user.groups.add(group)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()

        # Sync is_staff with ADMIN group if it was changed
        if 'is_staff' in validated_data:
            if user.is_staff:
                group, _ = Group.objects.get_or_create(name='ADMIN')
                user.groups.add(group)
            else:
                try:
                    group = Group.objects.get(name='ADMIN')
                    user.groups.remove(group)
                except Group.DoesNotExist:
                    pass

        return user

class RoutePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePermission
        fields = ('route_name',)

class GroupSerializer(serializers.ModelSerializer):
    route_permissions = serializers.SlugRelatedField(
        many=True,
        slug_field='route_name',
        queryset=RoutePermission.objects.all(),
        required=False
    )

    permissions = serializers.SerializerMethodField()
    component_permissions = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ('id', 'name', 'description', 'permissions', 'route_permissions', 'component_permissions')

    def get_permissions(self, obj):
        return [rp.route_name for rp in obj.route_permissions.all()]

    def get_component_permissions(self, obj):
        return [cp.component_key for cp in obj.component_permissions.all()]

    def get_description(self, obj):
        try:
            return obj.profile.description
        except GroupProfile.DoesNotExist:
            return ''

    def create(self, validated_data):
        request_data = self.context.get('request').data
        permissions_data = request_data.get('permissions', [])
        component_permissions_data = request_data.get('component_permissions', [])
        description = request_data.get('description', '')

        group = super().create(validated_data)

        GroupProfile.objects.create(group=group, description=description)
        for route in permissions_data:
            RoutePermission.objects.create(group=group, route_name=route)
        for key in component_permissions_data:
            ComponentPermission.objects.create(group=group, component_key=key)

        return group

    def update(self, instance, validated_data):
        request_data = self.context.get('request').data
        permissions_data = request_data.get('permissions', None)
        component_permissions_data = request_data.get('component_permissions', None)
        description = request_data.get('description', None)

        group = super().update(instance, validated_data)

        if description is not None:
            GroupProfile.objects.update_or_create(group=instance, defaults={'description': description})

        if permissions_data is not None:
            instance.route_permissions.all().delete()
            for route in permissions_data:
                RoutePermission.objects.create(group=instance, route_name=route)

        if component_permissions_data is not None:
            instance.component_permissions.all().delete()
            for key in component_permissions_data:
                ComponentPermission.objects.create(group=instance, component_key=key)

        return group

class UserDetailSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    role = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    component_permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_admin', 'role', 'permissions', 'component_permissions', 'phone')

    def get_role(self, obj):
        group = obj.groups.first()
        if group:
            return group.name

        if obj.is_staff:
            return 'ADMIN'

        return 'USER'

    def get_permissions(self, obj):
        if obj.is_staff or obj.groups.filter(name='ADMIN').exists():
            return ['all']

        perms = set()
        for group in obj.groups.all():
            for rp in group.route_permissions.all():
                perms.add(rp.route_name)
        return list(perms)

    def get_component_permissions(self, obj):
        # Deny list: retorna as chaves que estão BLOQUEADAS para este utilizador.
        # Admin não tem bloqueios — lista vazia significa "pode ver tudo".
        if obj.is_staff or obj.groups.filter(name='ADMIN').exists():
            return []

        denied = set()
        for group in obj.groups.all():
            for cp in group.component_permissions.all():
                denied.add(cp.component_key)
        return list(denied)
