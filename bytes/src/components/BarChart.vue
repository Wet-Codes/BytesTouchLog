<template>
  <div class="chart-container">
    <canvas ref="barCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const barCanvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      const ctx = barCanvas.value.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: props.data.map(d => d.name),
          datasets: [
            {
              label: 'Attendance',
              data: props.data.map(d => d.value),
              backgroundColor: '#289bb8',
              borderColor: '#1e88e5',
              borderWidth: 1,
              hoverBackgroundColor: '#1e88e5'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'white',
                font: {
                  family: 'Poppins'
                }
              }
            },
            title: {
              display: true,
              text: 'Event Attendance by Course',
              color: 'white',
              font: {
                family: 'Poppins',
                size: 16
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white',
                font: {
                  family: 'Poppins'
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: 'white',
                font: {
                  family: 'Poppins'
                }
              },
              beginAtZero: true
            }
          }
        }
      });
    };

    onMounted(() => {
      createChart();
    });

    watch(
      () => props.data,
      () => {
        createChart();
      },
      { deep: true }
    );

    return {
      barCanvas
    };
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>