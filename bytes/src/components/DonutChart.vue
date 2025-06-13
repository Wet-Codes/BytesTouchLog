<!-- src/components/DonutChart.vue -->
<template>
  <div class="donut-chart-container">
    <canvas ref="donutChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import ChartDoughnutLabel from 'chartjs-plugin-doughnutlabel-rebourne';

export default {
  name: 'DonutChart',
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
      Chart.register(...registerables, ChartDoughnutLabel);
      
      if (this.chart) {
        this.chart.destroy();
      }
      
      const ctx = this.$refs.donutChart.getContext('2d');
      
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#2196F3',
              bodyColor: 'white',
              borderColor: '#2196F3',
              borderWidth: 1
            },
            doughnutlabel: {
              labels: [
                {
                  text: 'CICS',
                  font: {
                    size: 20,
                    weight: 'bold',
                    family: "'Poppins', sans-serif"
                  },
                  color: 'white'
                },
                {
                  text: 'Students',
                  font: {
                    size: 16,
                    family: "'Poppins', sans-serif"
                  },
                  color: 'rgba(255,255,255,0.8)'
                }
              ]
            }
          },
          cutout: '70%',
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
.donut-chart-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>