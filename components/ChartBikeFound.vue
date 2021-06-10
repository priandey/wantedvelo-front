<template>
  <apexchart type="donut" :options="options" :series="series"></apexchart>
</template>

<script>
    export default {
        name: "ChartBikeFound",
      props: {
        bikes: {
          type: Array
        },
      },
      data: function() {
        return {
          options: {
            title: {
              text: "Part des vélos retrouvés"
            },
            theme: {
              mode: 'dark',
              palette: 'palette2',
            },
            chart: {
              id: 'bikefound',
              toolbar: {
                show:true
              }
            },
            labels: ['Encore marqué disparus', "Retrouvés"],
            dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                return Math.round(val) + "%"
              },
            }
          },
          series: [0,0],
        }
      },
      methods: {
          compile() {
            this.bikes.forEach(bike => {
              if (bike.robbed) {
                this.series[0] += 1
              } else {
                this.series[1] += 1
              }
            })
          }
      },
      watch: {
        'bikes'(val) {
          if (val.length > 0) {
            this.compile()
          }
        }
      }
    }
</script>

<style scoped>

</style>
