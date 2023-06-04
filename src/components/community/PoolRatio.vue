<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-wrap items-center justify-center gap-10px">
      <button v-for="(item, index) of chartData.data.datasets[0].data" :key="index"
              class="flex justify-between items-center h-34px px-10px rounded-8px"
              :style="{'background': getColor(index)}">
        <span class="text-14px text-white">{{ item.name || "--" }}: </span>
        <span class="text-14px text-white">{{ parseFloat(item.ratio / 100) }}%</span>
      </button>
    </div>
    <div class="flex-1 mx-auto w-full max-w-80vw sm:max-w-20rem">
      <canvas :id="canvasId" class="mx-auto"></canvas>
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
            padding: 80
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
              color: ({dataIndex, dataset}) => {
                return dataset.backgroundColor[dataIndex]
              },
              clip: false,
              anchor: 'end',
              align: 'end',
              offset: 5,
              font: {
                weight: 'bold'
              },
              padding: 6,
              formatter: (value) => {
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
    colorList () {
      let l = []
      let opacity=1
      const sub = 1/this.poolsData.length>0.15?0.15:0.1
      for(let i=1; i<this.poolsData.length+1; i++) {
        l.push(`rgba(98, 70, 234, ${opacity})`)
        opacity-=sub
      }
      return l
    },
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
      default: true
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
