<template>
    <div class="container mx-auto px-4 py-8 min-h-screen flex items-center">
      <div class="w-full">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
          <!-- Imagem à esquerda -->
          <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              :src="svgImage" 
              alt="Scientists Search Illustration" 
              class="w-full max-w-md xl:max-w-lg transition-all duration-300 hover:scale-105"
            >
          </div>
          
          <!-- Conteúdo à direita -->
          <div class="w-full lg:w-1/2 max-w-xl">
            <div class="text-center lg:text-left mb-8">
              <h1 class="text-4xl sm:text-5xl font-bold mb-4" :class="isDarkMode.value ? 'text-white' : 'text-gray-800'">
                Pesquisa de Cientistas
              </h1>
              <p class="text-lg" :class="isDarkMode.value ? 'text-white' : 'text-gray-600'">
                Digite o nome de um cientista para explorar suas contribuições acadêmicas e descobrir suas publicações mais relevantes.
              </p>
            </div>
  
            <div class="relative">
              <!-- Input de pesquisa -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="getSuggestions"
                  type="text"
                  placeholder="Digite o nome do cientista..."
                  class="w-full p-4 pl-5 pr-12 text-lg border-2 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                         transition-all duration-300"
                />
                <!-- Ícone de lupa ou loading -->
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div v-if="isLoading" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  <svg v-else class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
  
              <!-- Lista de sugestões -->
              <transition name="fade">
                <ul v-if="suggestions.length > 0" 
                    class="absolute z-10 w-full bg-white border-2 border-t-0 rounded-b-lg shadow-lg max-h-64 overflow-y-auto divide-y divide-gray-100">
                  <li v-for="suggestion in suggestions"
                      :key="suggestion.id"
                      @click="selectScientist(suggestion)"
                      class="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                    <div class="flex items-left">
                      <div class="flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span class="text-blue-600 font-semibold">
                            {{ suggestion.display_name.charAt(0) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4 text-left">
                        <div class="text-sm font-medium text-gray-900">
                          {{ suggestion.display_name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ suggestion.last_known_institution?.display_name || 'Instituição não disponível' }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </transition>
              
              <!-- Espaço reservado para mensagem de feedback -->
              <div class="h-6 mt-2" :class="{'invisible': suggestions.length > 0}">
                <p v-if="searchQuery.length > 0 && searchQuery.length < 3" 
                   class="text-sm text-gray-500 transition-opacity duration-200">
                  Digite pelo menos 3 caracteres para buscar...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import svgImage from '../assets/people-search-rafiki.svg';

export default {
name: 'SearchPage',
setup() {
    const searchQuery = ref('');
    const suggestions = ref([]);
    const router = useRouter();

    const injectedDarkMode = inject('isDarkMode');
    const isDarkMode = computed(() => injectedDarkMode);

    const getSuggestions = async () => {
    if (searchQuery.value.length < 3) {
        suggestions.value = [];
        return;
    }

    const response = await fetch(`https://api.openalex.org/authors?search=${searchQuery.value}`);
    const data = await response.json();
    suggestions.value = data.results;
    };

    const selectScientist = (scientist) => {
    router.push({ 
        name: 'ScientistDetails', 
        params: { id: scientist.id.split('https://openalex.org/')[1] }, 
        state: { scientist } 
    });
    };

    return {
      searchQuery,
      suggestions,
      getSuggestions,
      selectScientist,
      svgImage,
      isDarkMode
    };
},
};
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>