<!-- frontend/src/components/NotesList.vue -->
<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const router = useRouter()
const notesStore = useNotesStore()

const { notes, loading, error, sortedNotes } = notesStore

onMounted(() => {
  notesStore.fetchNotes()
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

const truncateContent = (content, maxLength = 150) => {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '...'
}

const viewNote = (id) => {
  router.push(`/notes/${id}`)
}

const editNote = (id) => {
  router.push(`/notes/${id}/edit`)
}

const createNote = () => {
  router.push('/notes/create')
}

const deleteNote = async (id) => {
  if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
    try {
      await notesStore.deleteNote(id)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}
</script>

<template>
  <div class="w-full p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Мои заметки</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Всего заметок: {{ notesStore.notesCount }}
        </p>
      </div>
      <button
        @click="createNote"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Создать заметку
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      <div class="flex justify-between items-center">
        <span>{{ error }}</span>
        <button 
          @click="notesStore.clearError()"
          class="text-red-700 hover:text-red-900"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && sortedNotes.length === 0" class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900 dark:text-white">Пока нет заметок</h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Создайте свою первую заметку, чтобы начать.</p>
      <button
        @click="createNote"
        class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Создать заметку
      </button>
    </div>

    <!-- Notes Grid -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="note in sortedNotes"
        :key="note.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <div class="p-6">
          <!-- Note Title -->
          <h3 
            class="text-xl font-semibold text-gray-900 dark:text-white mb-3 cursor-pointer hover:text-blue-600 transition-colors"
            @click="viewNote(note.id)"
          >
            {{ note.title }}
          </h3>
          
          <!-- Note Content Preview -->
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {{ truncateContent(note.content) }}
          </p>
          
          <!-- Note Meta -->
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <p>Создано: {{ formatDate(note.created_at) }}</p>
            <p v-if="note.updated_at !== note.created_at">
              Изменено: {{ formatDate(note.updated_at) }}
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="viewNote(note.id)"
              class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Просмотр
            </button>
            <button
              @click="editNote(note.id)"
              class="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Редактировать
            </button>
            <button
              @click="deleteNote(note.id)"
              class="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>