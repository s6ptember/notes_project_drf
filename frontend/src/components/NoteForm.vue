<!-- frontend/src/components/NoteForm.vue -->
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const props = defineProps({
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const router = useRouter()
const route = useRoute()
const notesStore = useNotesStore()

const isEditMode = computed(() => props.mode === 'edit')
const pageTitle = computed(() => isEditMode.value ? 'Редактировать заметку' : 'Создать заметку')

const form = reactive({
  title: '',
  content: ''
})

const errors = ref({})
const saving = ref(false)

// Валидация
const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'Заголовок обязателен'
  } else if (form.title.length > 200) {
    errors.value.title = 'Заголовок не может быть длиннее 200 символов'
  }
  
  if (!form.content.trim()) {
    errors.value.content = 'Содержание обязательно'
  } else if (form.content.length > 10000) {
    errors.value.content = 'Содержание не может быть длиннее 10000 символов'
  }
  
  return Object.keys(errors.value).length === 0
}

// Загрузка существующей заметки для редактирования
onMounted(async () => {
  if (isEditMode.value) {
    const noteId = parseInt(route.params.id)
    try {
      const note = await notesStore.fetchNote(noteId)
      form.title = note.title
      form.content = note.content
    } catch (error) {
      console.error('Error loading note:', error)
      router.push('/notes')
    }
  }
})

// Сохранение заметки
const saveNote = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    const noteData = {
      title: form.title.trim(),
      content: form.content.trim()
    }
    
    if (isEditMode.value) {
      const noteId = parseInt(route.params.id)
      await notesStore.updateNote(noteId, noteData)
    } else {
      await notesStore.createNote(noteData)
    }
    
    router.push('/notes')
  } catch (error) {
    console.error('Error saving note:', error)
  } finally {
    saving.value = false
  }
}

// Отмена
const cancel = () => {
  router.push('/notes')
}

// Обработка изменений в форме для очистки ошибок
const clearFieldError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="cancel"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveNote" class="space-y-6">
      <!-- Title Field -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Заголовок *
        </label>
        <input
          id="title"
          v-model="form.title"
          @input="clearFieldError('title')"
          type="text"
          placeholder="Введите заголовок заметки"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
          :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.title }"
        />
        <div class="flex justify-between mt-1">
          <p v-if="errors.title" class="text-sm text-red-600">{{ errors.title }}</p>
          <p class="text-sm text-gray-500 ml-auto">{{ form.title.length }}/200</p>
        </div>
      </div>

      <!-- Content Field -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Содержание *
        </label>
        <textarea
          id="content"
          v-model="form.content"
          @input="clearFieldError('content')"
          rows="15"
          placeholder="Введите содержание заметки"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors resize-y"
          :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': errors.content }"
        ></textarea>
        <div class="flex justify-between mt-1">
          <p v-if="errors.content" class="text-sm text-red-600">{{ errors.content }}</p>
          <p class="text-sm text-gray-500 ml-auto">{{ form.content.length }}/10000</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 pt-6">
        <button
          type="submit"
          :disabled="saving || notesStore.loading"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg 
            v-if="saving || notesStore.loading" 
            class="animate-spin h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Сохранение...' : (isEditMode ? 'Сохранить изменения' : 'Создать заметку') }}
        </button>
        
        <button
          type="button"
          @click="cancel"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Отмена
        </button>
      </div>
    </form>

    <!-- Preview Section (Optional) -->
    <div v-if="form.content" class="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Предварительный просмотр</h3>
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {{ form.title || 'Без заголовка' }}
        </h4>
        <div class="prose dark:prose-invert max-w-none">
          <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ form.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>