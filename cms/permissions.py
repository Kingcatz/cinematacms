from django.conf import settings
from rest_framework import permissions
from files.methods import is_mediacms_editor, is_mediacms_manager


class IsAuthorizedToAdd(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return user_allowed_to_upload(request)


class IsUserOrManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_superuser:
            return True
        if is_mediacms_manager(request.user):
            return True

        if hasattr(obj, "user"):
            return obj.user == request.user
        else:
            return obj == request.user


class IsUserOrEditor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_superuser:
            return True
        if is_mediacms_editor(request.user):
            return True

        return obj.user == request.user


def user_allowed_to_upload(request):
    # CUSTOM LOGIC SHOULD GO HERE!
    if request.user.is_anonymous:
        return False
    if request.user.is_superuser:
        return True

    if settings.CAN_ADD_MEDIA == "all":
        return True
    elif settings.CAN_ADD_MEDIA == "email_verified":
        if request.user.email_is_verified:
            return True
    elif settings.CAN_ADD_MEDIA == "advancedUser":
        if request.user.advancedUser:
            return True
    return False
