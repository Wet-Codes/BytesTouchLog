<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'AreaChart',
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
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    Chart.register(...registerables);
    this.renderChart();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        if (this.chart) {
          this.chart.data = this.data;
          this.chart.update();
        } else {
          this.renderChart();
        }
      }
    },
    options: {
      deep: true,
      handler() {
        if (this.chart) {
          this.chart.options = this.options;
          this.chart.update();
        }
      }
    }
  },
  methods: {
    renderChart() {
      if (this.$refs.chartCanvas) {
        this.chart = new Chart(this.$refs.chartCanvas, {
          type: 'line',
          data: this.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: 'white'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#2196F3',
                bodyColor: 'white',
                borderColor: '#2196F3',
                borderWidth: 1
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white'
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white'
                }
              }
            },
            elements: {
              point: {
                radius: 4,
                hoverRadius: 6,
                backgroundColor: '#2196F3',
                borderColor: 'white',
                borderWidth: 2
              }
            },
            ...this.options
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>