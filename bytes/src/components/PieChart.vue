<!-- src/components/PieChart.vue -->
<template>
  <div class="pie-chart-container">
    <canvas ref="pieChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'PieChart',
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
      
      const ctx = this.$refs.pieChart.getContext('2d');
      
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: 'white',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 12
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
                  return `${context.label}: ${context.raw}`;
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
.pie-chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>