<!-- src/components/BarChart.vue -->
<template>
  <div class="bar-chart-container">
    <canvas ref="barChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    data: {
      handler() {
        this.renderChart();
      },
      deep: true
    },
    options: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  },
  methods: {
    renderChart() {
      Chart.register(...registerables);
      
      if (this.chart) {
        this.chart.destroy();
      }
      
      const ctx = this.$refs.barChart.getContext('2d');
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white'
              }
            },
            y: {
              stacked: false,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#2196F3',
              bodyColor: 'white',
              borderColor: '#2196F3',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw}`;
                }
              }
            }
          },
          ...this.options
        }
      });
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
};
</script>

<style scoped>
.bar-chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>