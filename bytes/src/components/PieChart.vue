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
      type: Array,
      required: true
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
    }
  },
  methods: {
    renderChart() {
      Chart.register(...registerables);
      
      // Destroy previous chart if it exists
      if (this.chart) {
        this.chart.destroy();
      }
      
      const ctx = this.$refs.pieChart.getContext('2d');
      
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.data.map(item => item.name),
          datasets: [{
            data: this.data.map(item => item.value),
            backgroundColor: this.data.map(item => item.color || '#3498db'),
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'white',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.raw}%`;
                }
              }
            }
          }
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