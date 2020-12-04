let localisation = new Vue({
    el:"#localisation",
    data: {
       coords: {
           lat:'',
           lon:'',
       },
        locality: '',
        finder:{
           kw:'',
        }

    },
    mounted: function() {
        getUserCoordinates()
            .then(coords => {
                localisation.coords.lat = coords.lat;
                localisation.coords.lon = coords.lon;
                axios.get("https://api-adresse.data.gouv.fr/reverse/", {
                    params: {
                        lon: coords.lon,
                        lat: coords.lat
                    }
                })
                    .then(response => {
                        localisation.locality = response.data.features[0].properties.city;
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }
});

function getUserCoordinates() {
    return new Promise((resolve, reject) => {
        let coords = {
            lat:'',
            lon:'',
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                coords.lat = position.coords.latitude;
                coords.lon = position.coords.longitude;
                resolve(coords);
            }, () => resolve({
                lat:48.852969,
                lon:2.349903,
            }))
        } else {
            reject(new Error("Failed to geolocate"));
        }
    });
};