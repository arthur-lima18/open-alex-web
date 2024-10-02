<template>
  <div class="min-h-screen transition-colors duration-300" :class="{ 'dark': isDarkMode }">
    <!-- Theme Toggle Button -->
    <button 
      @click="toggleTheme" 
      class="fixed top-4 right-4 z-50 p-2 rounded-full transition-colors duration-200"
      :class="{ 'bg-gray-200 hover:bg-gray-300': !isDarkMode, 'bg-gray-700 hover:bg-gray-600': isDarkMode }"
      aria-label="Toggle theme"
    >
      <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>

    <!-- Main Content -->
    <div class="app-container bg-gray-100 dark:bg-gray-900 min-h-screen">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue';

export default {
  name: 'App',
  setup() {
    const isDarkMode = ref(false);

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false');
      updateTheme();
    };

    const updateTheme = () => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-900');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
      }
    };

    onMounted(() => {
      // Check for saved user preference, either in localStorage or OS settings
      const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      isDarkMode.value = darkModePreference;
      updateTheme();
    });

    // Provide isDarkMode to all components
    provide('isDarkMode', isDarkMode);

    return {
      isDarkMode,
      toggleTheme
    };
  }
};
</script>

<style>
/* Ensure the body takes up full height and sets background color */
html, body {
  height: 100%;
}

body {
  transition: background-color 0.3s;
}

html.dark,
html.dark body {
  @apply bg-gray-900;
}
</style>