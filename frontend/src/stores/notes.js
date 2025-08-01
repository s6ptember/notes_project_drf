// frontend/src/stores/notes.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import apiService from '@/services/api'

export const useNotesStore = defineStore('notes', () => {
  // State
  const notes = ref([])
  const currentNote = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const notesCount = computed(() => notes.value.length)
  const sortedNotes = computed(() => 
    [...notes.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  )

  // Actions
  async function fetchNotes() {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiService.getNotes()
      notes.value = data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch notes:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchNote(id) {
    loading.value = true
    error.value = null
    
    try {
      const data = await apiService.getNote(id)
      currentNote.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createNote(noteData) {
    loading.value = true
    error.value = null
    
    try {
      const newNote = await apiService.createNote(noteData)
      notes.value.push(newNote)
      return newNote
    } catch (err) {
      error.value = err.message
      console.error('Failed to create note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNote(id, noteData) {
    loading.value = true
    error.value = null
    
    try {
      const updatedNote = await apiService.updateNote(id, noteData)
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = updatedNote
      }
      return updatedNote
    } catch (err) {
      error.value = err.message
      console.error('Failed to update note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNote(id) {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteNote(id)
      notes.value = notes.value.filter(note => note.id !== id)
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = null
      }
    } catch (err) {
      error.value = err.message
      console.error('Failed to delete note:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentNote() {
    currentNote.value = null
  }

  return {
    // State
    notes,
    currentNote,
    loading,
    error,
    
    // Getters
    notesCount,
    sortedNotes,
    
    // Actions
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    clearError,
    clearCurrentNote
  }
})