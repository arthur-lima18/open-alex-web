<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"
      ></div>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
        Carregando dados do cientista...
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div
        class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong class="font-bold">Erro!</strong>
        <span class="block sm:inline">
          Não foi possível carregar os dados do cientista.</span
        >
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="scientist" class="space-y-6">
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {{ scientist.display_name }}
        </h1>
        <p
          v-if="currentInstitution"
          class="text-lg text-gray-600 dark:text-gray-300"
        >
          {{ currentInstitution.display_name }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <h3
            class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            {{ stat.label }}
          </h3>
          <p class="text-3xl font-bold" :class="stat.textColor">
            {{ stat.value }}
          </p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Publications Over Time Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
          >
            Publicações ao Longo do Tempo
          </h2>
          <div class="h-64">
            <v-chart
              class="w-full h-full"
              :option="publicationsChartData"
              autoresize
            />
          </div>
        </div>

        <!-- Citations Distribution Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
          >
            Distribuição de Citações
          </h2>
          <div class="h-64">
            <v-chart
              class="w-full h-full"
              :option="citationsChartData"
              autoresize
            />
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-6">
          <!-- Institutions -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Trajetória Institucional
            </h2>
            <div class="space-y-4">
              <div
                v-if="currentInstitution"
                class="border-l-4 border-blue-500 pl-4"
              >
                <h3 class="font-semibold text-gray-700 dark:text-gray-200">
                  Instituição Atual
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ currentInstitution.display_name }}
                </p>
              </div>
              <div
                v-if="previousInstitutions.length"
                class="border-l-4 border-gray-300 pl-4"
              >
                <h3 class="font-semibold text-gray-700 dark:text-gray-200">
                  Instituições Anteriores
                </h3>
                <ul class="mt-2 space-y-2">
                  <li
                    v-for="inst in previousInstitutions"
                    :key="inst.id"
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ inst.display_name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Topics -->
          <div
            v-if="concepts.length"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Áreas de Pesquisa
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="concept in concepts"
                :key="concept.id"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {{ concept.display_name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Top Works -->
          <div
            v-if="topWorks.length"
            class="scrollable-content bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2
              class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              Artigos Mais Citados
            </h2>
            <div class="space-y-4">
              <div
                v-for="(work, index) in topWorks"
                :key="work.id"
                class="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white flex items-center justify-center"
                  >
                    {{ index + 1 }}
                  </span>
                  <div class="ml-4">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">
                      {{ work.title }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ work.publication_year }}
                    </p>
                    <div class="mt-2 flex items-center">
                      <span
                        class="text-sm font-medium text-gray-600 dark:text-gray-300"
                      >
                        {{ work.cited_by_count }} citações
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-8">
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Nenhum dado encontrado para este cientista.
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default {
  name: "ScientistDetails",
  components: {
    VChart,
  },
  setup() {
    const route = useRoute();
    const scientist = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const topWorks = ref([]);
    const isDarkMode = inject("isDarkMode");

    const currentInstitution = computed(() => {
      return scientist.value?.last_known_institution || null;
    });

    const previousInstitutions = computed(() => {
      if (!scientist.value?.last_known_institutions) return [];
      return scientist.value.last_known_institutions
        .filter((aff) => aff.id !== currentInstitution.value?.id)
        .slice(0, 5);
    });

    const concepts = computed(() => {
      return (scientist.value?.x_concepts || []).slice(0, 10);
    });

    const stats = computed(() => [
      {
        label: "Publicações",
        value: scientist.value?.works_count || 0,
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Índice h",
        value: scientist.value?.summary_stats?.h_index || "N/A",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        label: "Citações",
        value: scientist.value?.summary_stats?.cited_by_count || 0,
        textColor: "text-purple-600 dark:text-purple-400",
      },
      {
        label: "Instituições",
        value: (previousInstitutions.value?.length || 0) + 1,
        textColor: "text-orange-600 dark:text-orange-400",
      },
    ]);

    const citationsChartData = computed(() => {
      const data = scientist.value.counts_by_year;

      return {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: data.map(item => item.year), // Anos no eixo X
        },
        yAxis: {
          type: 'value',
          name: 'Citações', // Rotulo do eixo Y
        },
        series: [
          {
            name: 'Citações por Ano',
            data: data.map(item => item.cited_by_count), // Contagem de citações no eixo Y
            type: 'bar', // Tipo de gráfico
            smooth: true,
            lineStyle: { width: 3 },
          }
        ]}
    });

    const fetchScientistDetails = async () => {
      try {
        const scientistId = route.params.id;
        loading.value = true;
        error.value = false;

        const [scientistResponse, worksResponse] = await Promise.all([
          fetch(`https://api.openalex.org/authors/${scientistId}`),
          fetch(
            `https://api.openalex.org/works?filter=author.id:${scientistId}&sort=cited_by_count:desc&per-page=5`
          ),
        ]);

        if (!scientistResponse.ok || !worksResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [scientistData, worksData] = await Promise.all([
          scientistResponse.json(),
          worksResponse.json(),
        ]);
        scientist.value = scientistData;
        topWorks.value = worksData.results;
      } catch (err) {
        console.error("Error fetching scientist details:", err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchScientistDetails();
    });

    return {
      scientist,
      loading,
      error,
      currentInstitution,
      previousInstitutions,
      concepts,
      topWorks,
      stats,
      isDarkMode,
      citationsChartData,
    };
  },
  computed: {
    publicationsChartData() {
      const years = this.publicationData.map((item) => item.year);
      const counts = this.publicationData.map((item) => item.count);

      return {
        tooltip: {
          trigger: "axis",
          backgroundColor: this.isDarkMode ? "#374151" : "#FFFFFF",
          borderColor: this.isDarkMode ? "#4B5563" : "#E5E7EB",
          textStyle: {
            color: this.isDarkMode ? "#E5E7EB" : "#1F2937",
          },
        },
        xAxis: {
          type: "category",
          data: years,
          axisLabel: {
            color: this.isDarkMode ? "#9CA3AF" : "#4B5563",
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: this.isDarkMode ? "#9CA3AF" : "#4B5563",
          },
          splitLine: {
            lineStyle: {
              color: this.isDarkMode ? "#374151" : "#E5E7EB",
            },
          },
        },
        series: [
          {
            data: counts,
            type: "line",
            smooth: true,
            lineStyle: {
              color: this.isDarkMode ? "#60A5FA" : "#2563EB",
            },
            itemStyle: {
              color: this.isDarkMode ? "#60A5FA" : "#2563EB",
            },
          },
        ],
      };
    },
  },
  data() {
    return {
      publicationData: [],
    };
  },
  methods: {
    async fetchPublicationData(authorId) {
      try {
        const response = await axios.get(
          `https://api.openalex.org/works?group_by=publication_year&per_page=200&filter=authorships.author.id:${authorId}`
        );
        const groupedData = response.data.group_by;

        this.publicationData = groupedData.map((item) => ({
          year: item.key,
          count: item.count,
        }));
      } catch (error) {
        console.error("Erro ao buscar os dados de publicações:", error);
      }
    },
  },
  mounted() {
    const authorId = this.$route.params.id;
    this.fetchPublicationData(authorId);
  },
};
</script>
<style scoped>
.scrollable-content {
  max-height: 36.5vh; /* Ajuste conforme necessário */
  overflow-y: auto;
}
</style>
