# Содержит представления для обработки запросов API

from rest_framework import generics, status
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache  import cache_page
from .models import Note
from .serializers import NoteSerializer, NoteCreateSerializer, NoteUpdateSerializer

class NoteListCreateView(generics.ListCreateAPIView):
    # представление для списка и создания заметок
    queryset = Note.objects.all()

    def get_serializer_class(self):
        # Возвращает подходящий сериализатор в зависимости от запроса
        if self.request.method == 'POST':
            return NoteCreateSerializer
        return NoteSerializer
    
    def get(self, request, *args, **kwargs):
        # Обрабатывает GET запрос для получения списка заметок
        return super().get(request, *args, **kwargs)
    
class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()

    def get_serializer_class(self):
        # Возвращает подходящий сериализатор в зависимости от запроса
        if self.request.method in ['PUT', 'PATCH']:
            return NoteUpdateSerializer
        return NoteSerializer
    
    def update(self, request, *args, **kwargs):
        # Обрабатывает обновление заметки с валидацией
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        # Метод удаления заметки
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'message': 'Заметка успешно удалена'},
            status=status.HTTP_204_NO_CONTENT,
        )
    