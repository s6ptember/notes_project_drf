<!-- frontend/src/App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <RouterLink to="/" class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Notes App</span>
            </RouterLink>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-8">
            <RouterLink 
              to="/" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
            >
              Главная
            </RouterLink>
            <RouterLink 
              to="/notes" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/notes') }"
            >
              Заметки
            </RouterLink>
            <RouterLink 
              to="/about" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/about' }"
            >
              О приложении
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="w-full py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2025 Notes App. Создано с помощью Django REST Framework и Vue.js
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  color: rgb(37 99 235) !important;
}

@media (prefers-color-scheme: dark) {
  .router-link-exact-active {
    color: rgb(96 165 250) !important;
  }
}
</style>