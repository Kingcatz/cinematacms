from django.contrib import admin

from .models import BlackListedEmail, User


class BlackListedEmailAdmin(admin.ModelAdmin):
    pass


class UserAdmin(admin.ModelAdmin):
    search_fields = ["email", "username", "name"]
    exclude = (
        "user_permissions",
        "institution",
        "title",
        "password",
        "groups",
        "last_login",
        "is_featured",
        "location",
        "first_name",
        "last_name",
        "media_count",
        "date_joined",
        "is_staff",
        "is_active",
    )
    list_display = [
        "username",
        "advancedUser",
        "name",
        "email",
        "media_count",
        "logo",
        "date_added",
        "is_superuser",
        "is_editor",
        "is_manager",
    ]
    list_filter = ["is_superuser", "is_editor", "is_manager"]
    ordering = ("-date_added",)


# TODO: is_superuser: global site administrator
# SHOW IF EDITOR, also next in list filter TODO
admin.site.register(User, UserAdmin)
admin.site.register(BlackListedEmail, BlackListedEmailAdmin)
