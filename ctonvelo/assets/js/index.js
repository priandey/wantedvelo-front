const API_ROOT = "http://127.0.0.1:8000/sam/";

var localisation = new Vue({
    el:"#localisation",
    data: {
       coords: {
           lat:'',
           lon:'',
       },
        locality: '',
        finder: {
            kw:'',
            proposition: 1,
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
                        let locality = response.data.features[0];
                        localisation.locality = locality.properties.city + ", "+locality.properties.postcode;
                        bikeBoard.get_near_bikes();
                    })
            })
            .catch(error => {
                console.log(error)
            })
    },
    methods: {
        locate_user: function() {
            axios.get("https://api-adresse.data.gouv.fr/search/", {
                params: {
                    q: localisation.finder.kw,
                    limit: localisation.finder.propoition,
                    // TODO : Would be great to have  detection for postcode with regex
                }
            })
                .then(response => {
                    let locality = response.data.features[0];
                    localisation.coords.lon = locality.geometry.coordinates[0];
                    localisation.coords.lat = locality.geometry.coordinates[1];
                    localisation.locality = locality.properties.city + ", " + locality.properties.postcode;
                    bikeBoard.get_near_bikes();
                })
                .catch(error => {
                    console.log(error);
                })

        }
    }
});

var bikeBoard = new Vue({
    el: "#bike-board",
    data: {
        bikes: [],
        endpoints: {
            stolenBikes: "stolen-bikes/",
            reportFound: "found/",
        },
    },
    methods: {
        get_near_bikes: function() {
            bikeBoard.bikes = [];
            axios.get(API_ROOT + bikeBoard.endpoints.stolenBikes, {
                params: {
                    type: 'near',
                    lon: localisation.coords.lon,
                    lat: localisation.coords.lat,
                }
            })
                .then(response => {
                    response.data.forEach(item => {
                        item.distance = Math.round(haversineDistance(
                            [
                                item.robbed_location.longitude,
                                item.robbed_location.latitude
                            ],
                            [
                                localisation.coords.lon,
                                localisation.coords.lat,
                            ]
                        ));
                        item.seen = {
                            toggle: false,
                            message:'',
                        };
                        bikeBoard.bikes.push(item)
                    })
                });
        },
        toggle_seen: function(id) {
            bikeBoard.bikes[id].seen.toggle = !bikeBoard.bikes[id].seen.toggle;
            bikeBoard.bikes[id].seen.message = ''
        },
        report_found: function(id) {
            axios.post(API_ROOT + bikeBoard.endpoints.reportFound, {
                message: bikeBoard.bikes[id].seen.message,
                reference: bikeBoard.bikes[id].reference,
                coords: localisation.coords
            })
                .then(response => {
                    bikeBoard.toggle_seen(id);
                })
        },
    }
});
// TODO : Violating DRY rule here
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
function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
};
