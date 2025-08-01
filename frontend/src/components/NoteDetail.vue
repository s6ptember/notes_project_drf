<!-- frontend/src/components/NoteDetail.vue -->
<script setup>
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const router = useRouter()
const route = useRoute()
const notesStore = useNotesStore()

const noteId = computed(() => parseInt(route.params.id))

onMounted(() => {
  if (noteId.value) {
    notesStore.fetchNote(noteId.value)
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.push('/notes')
}

const editNote = () => {
  router.push(`/notes/${noteId.value}/edit`)
}

const deleteNote = async () => {
  if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
    try {
      await notesStore.deleteNote(noteId.value)
      router.push('/notes')
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading State -->
    <div v-if="notesStore.loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="notesStore.error" class="text-center py-12">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ notesStore.error }}
      </div>
      <button
        @click="goBack"
        class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Вернуться к списку
      </button>
    </div>

    <!-- Note Content -->
    <div v-else-if="notesStore.currentNote" class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ notesStore.currentNote.title }}
          </h1>
        </div>
        
        <div class="flex gap-2">
          <button
            @click="editNote"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать
          </button>
          
          <button
            @click="deleteNote"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Удалить
          </button>
        </div>
      </div>

      <!-- Note Meta Information -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span class="font-medium">Создано:</span>
            {{ formatDate(notesStore.currentNote.created_at) }}
          </div>
          <div v-if="notesStore.currentNote.updated_at !== notesStore.currentNote.created_at">
            <span class="font-medium">Последнее изменение:</span>
            {{ formatDate(notesStore.currentNote.updated_at) }}
          </div>
        </div>
      </div>

      <!-- Note Content -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div class="prose dark:prose-invert max-w-none">
          <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ notesStore.currentNote.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900 dark:text-white">Заметка не найдена</h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Запрашиваемая заметка не существует или была удалена.</p>
      <button
        @click="goBack"
        class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Вернуться к списку
      </button>
    </div>
  </div>
</template>