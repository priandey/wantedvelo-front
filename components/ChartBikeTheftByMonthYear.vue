<template>
  <apexchart type="bar" :options="options" :series="series"></apexchart>
</template>

<script>
    export default {
        name: "ChartBikeTheftByMonthYear",
      props: {
          bikes: {
            type: Array
          },
      },
      data: function() {
        return {
          options: {
            title: {
              text: 'Vols de vélos / mois et / années'
            },
            theme: {
              mode: 'dark',
              palette: 'palette2'
            },
            chart: {
              id: 'biketheftbymonth'
            },
            xaxis: {
              categories: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
            }
          },
          series: [],
          uniqueYears: []
        }
      },
      methods: {
          compile(){
            this.bikes.forEach(bike => {
              bike.date_of_robbery = new Date(bike.date_of_robbery);
              bike.month = bike.date_of_robbery.getMonth();
              bike.year = bike.date_of_robbery.getFullYear();
            });
            this.uniqueYears = [...new Set(this.bikes.map(item => item.year))];
            this.series = [];
            this.uniqueYears.forEach(year => {
              this.series.push({
                name: String(year),
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              });
            });
            this.series.forEach(serie => {
              this.bikes.forEach(bike => {
                if (String(bike.year) === serie.name) {
                  serie.data[bike.month] += 1;
                }
              });
            });
          },
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
