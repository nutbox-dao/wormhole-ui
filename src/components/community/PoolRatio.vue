<template>
  <div class="flex flex-col xs:flex-row 2md:flex-col lg:flex-row items-center">
<!--    <div class="flex flex-wrap items-center justify-center gap-10px">-->
<!--      <button v-for="(item, index) of chartData.data.datasets[0].data" :key="index"-->
<!--              class="flex justify-between items-center h-34px px-10px rounded-8px"-->
<!--              :style="{'background': getColor(index)}">-->
<!--        <span class="text-14px text-white">{{ item.name || "&#45;&#45;" }}: </span>-->
<!--        <span class="text-14px text-white">{{ parseFloat(item.ratio) }}%</span>-->
<!--      </button>-->
<!--    </div>-->
    <div class="flex-1 w-full flex flex-col gap-10px">
      <div class="flex justify-between"
           v-for="(item, index) of chartData.data.datasets[0].data" :key="index">
        <div class="flex items-center flex-1">
          <span class="border-4 rounded-full w-12px h-12px min-w-12px block mr-8px"
                :style="{ 'border-color': getColor(index)}"></span>
          <span class="text-14px">{{ item.name || "--" }}</span>
        </div>
        <span class="text-14px">{{ parseFloat(item.ratio) }}%{{ item.value ? `(${item.value})` : '' }}</span>
      </div>
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
import { formatAmount } from '@/utils/helper'

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
    // colorList () {
    //   let l = []
    //   let opacity=1
    //   const sub = 1/this.poolsData.length>0.15?0.15:0.1
    //   for(let i=1; i<this.poolsData.length+1; i++) {
    //     l.push(`rgba(98, 70, 234, ${opacity})`)
    //     opacity-=sub
    //   }
    //   return l
    // },
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
      data:  this.poolsData.map(pool => ({
        name: pool.name,
        ratio: parseFloat(pool.ratio) / 100,
        value: pool.value ? formatAmount(pool.value) : null
      })),
      backgroundColor: this.colorList
    }]
    this.chart = new Chart(ctx, this.chartData)
  }
}
</script>

<style scoped lang="scss">
</style>
