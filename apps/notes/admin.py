# Настраивает админку под работу с нашими моделями

from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    # Настройка админ-панели для модели Note
    list_display = ['title', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        # Группировка полей в админке
        ('Основная инфомрация', {
            'fields': ('title', 'content')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
