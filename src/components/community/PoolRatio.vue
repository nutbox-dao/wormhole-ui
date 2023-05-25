<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-15px">
    <div class="flex-1" :style="{width:'100%', maxWidth: '20rem', ...chartStyle}">
      <canvas :id="canvasId"></canvas>
    </div>
    <div v-if="showLegendInfo" class="flex-1 flex flex-col gap-10px w-full max-w-20rem">
      <div v-for="(item, index) of chartData.data.datasets[0].data" :key="index"
           class="w-full flex justify-between items-center">
        <div class="flex-1 flex items-center">
          <span class="block w-14px h-14px min-w-14px rounded-full border-4px mr-10px"
                :style="{ 'border-color': getColor(index)}"></span>
          <span class="text-14px">{{ item.name || "--" }}</span>
        </div>
        <span class="text-14px">{{ parseFloat(item.ratio) }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(
  ArcElement,
  DoughnutController,
  Tooltip
)
export default {
  name: 'PieChart',
  data () {
    return {
      chart: null,
      colorList: [
        '#FE6A07',
        '#7CBF4D',
        '#70ACFF',
        '#FFE14D',
        '#CC85FF',
        '#FF9500',
        '#00C7D9',
        '#9D94FF',
        '#FF73AD',
        '#FF7366',
        '#FF4D97',
        '#C881D2',
        '#DAD0ED',
        '#2780FD',
        '#00B9CD',
        '#91CF94',
        '#F4F5CE',
        '#FCB62E',
        '#FF9C26',
        '#FF7366',
        '#F57BA3',
        '#6456FF',
        '#70ACFF',
        '#5AD9E8',
        '#D1EAD2',
        '#9DAC00',
        '#FFE14D',
        '#FFCD7A'
      ],
      chartData: {
        type: 'doughnut',
        plugins: [ChartDataLabels],
        data: {
          labels: [],
          datasets: [
            {
              data: [{ ratio: 0, name: 'default' }]
            }
          ]
        },
        options: {
          responsive: true,
          cutout: '60%',
          parsing: {
            key: 'ratio'
          },
          layout: {
            padding: 70
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  return `${ctx.raw.name}: ${(Number(ctx.raw.ratio)).toFixed(2)}%`
                }
              }
            },
            datalabels: {
              color: 'white',
              clip: false,
              anchor: 'end',
              align: 'end',
              offset: 5,
              font: {
                weight: 'bold'
              },
              padding: 6,
              formatter: (value, ctx) => {
                if (this.showDataLabel) return value.name
                return Number(value.ratio).toFixed(2) + '%'
              },
              display: (ctx) => {
                return ctx.dataset.data[ctx.dataIndex].ratio > 1
              }
            }
          }
        }
      }
    }
  },
  computed: {
    getColor () {
      return (index) => {
        return this.colorList[index % this.colorList.length]
      }
    }
  },
  props: {
    poolsData: {
      type: Array,
      default: () => {
        return []
      }
    },
    showLegendInfo: {
      type: Boolean,
      default: true
    },
    showDataLabel: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    },
    chartStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    aspectRatio: {
      type: Number,
      default: 1
    },
    canvasId: {
      type: String,
      default: 'pie'
    },
    tooltipLabelFormatter: {
      type: Function,
      default: function (ctx) {
        return `${ctx.raw.name}: ${(Number(ctx.raw.ratio)).toFixed(2)}%`
      }
    }
  },
  watch: {
    poolsData: {
      handler: function (data) {
        this.chartData.data.datasets = [{
          data: data,
          backgroundColor: this.colorList
        }]
        this.chart.update()
      },
      deep: true
    }
  },
  mounted () {
    if (!this.animation) this.chartData.options.animation = false
    this.chartData.options.aspectRatio = this.aspectRatio
    this.chartData.options.plugins.tooltip.callbacks.label = this.tooltipLabelFormatter
    const ctx = document.getElementById(this.canvasId)
    this.chartData.data.datasets = [{
      data: this.poolsData,
      backgroundColor: this.colorList
    }]
    this.chart = new Chart(ctx, this.chartData)
  }
}
</script>

<style scoped lang="scss">
</style>
