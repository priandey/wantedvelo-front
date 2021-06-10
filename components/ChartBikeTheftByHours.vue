<template>
    <apexchart type="donut" :options="options" :series="series" ref="pieChart"></apexchart>
</template>

<script>
    export default {
        name: "ChartBikeTheftByHours",
      props: {
          bikes: {
            type: Array
          },
      },
      data: function() {
        return {
          options: {
            title: {
              text: "Vols de vélos en fonction de l'heure"
            },
            theme: {
              mode: 'dark',
              palette: 'palette2',
              monochrome: {
                enabled: true,
                color: '#4caf50',
                shadeTo: 'dark',
              }
            },
            chart: {
              id: 'biketheftbyhour',
              toolbar: {
                show:true
              }
            },
            labels: [],
            dataLabels: {
              enabled: true,
              formatter: function (val, opts) {
                return opts.w.config.labels[opts.seriesIndex] + " : " + Math.round(val) + "% " + "(" + opts.w.config.series[opts.seriesIndex] + ")"
              },
            }
          },
          series: [],
        }
      },
      methods: {
          compile(){
            this.bikes.forEach(bike => {
              bike.date_of_robbery = new Date(bike.date_of_robbery);
              bike.hour = bike.date_of_robbery.getHours()
            });
            this.options.labels = [...new Set(this.bikes.map(item => String(item.hour)+"h"))].sort();
            this.series = [];
            this.options.labels.forEach(hour => {
              let theft = 0;
              this.bikes.forEach(bike => {
                if (String(bike.hour) + "h" === hour){
                  theft += 1
                }
              });
              this.series.push(theft);
            });
            this.$refs.pieChart.refresh()
          },
      },
      watch: {
          'bikes'(val) {
            if (val.length > 0) {
              this.compile()
            }
          }
      },
    }
</script>

<style scoped>

</style>
