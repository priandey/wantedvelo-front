let params = (new URL(document.location)).searchParams;
let user = params.get("u");

const API_ROOT = "http://127.0.0.1:8000/";

var authentication = new Vue({
    el: "#authentication",
    data: {
        credentials: {
            loginToken: '',
            authToken: '',
        },
        user: {
            email: '',
            phone: '',
            username: '',
        },
        // TODO : Error management object
        isAuthenticated: false,
        mail_sent: false,
        open_edition: false,
        // API Endpoints below
        send_mail_ep: "auth/email/",
        send_token_ep: "auth/token/",
        get_user_ep: "owner/user_pannel/",

    },
    mounted: function () {
        if (storageAvailable('sessionStorage')) {
            if (sessionStorage.getItem('authToken')) {
                this.isAuthenticated = true;
                this.credentials.authToken = sessionStorage.getItem('authToken');
                this.get_user();
            }
        } else {
            console.log('Navigateur incompatible');
        }
    },
    methods: {
        send_mail: function () {
            axios.post(API_ROOT + this.send_mail_ep, {'email': this.user.email})
                .then(response => {
                    // Gerer la réponse
                    if (response.status === 200) {
                        authentication.mail_sent = true;
                    }
                })
                .catch(error => {
                    console.log("Error :", error.response.data)
                })
        },
        get_token: function () {
            axios.post(API_ROOT + this.send_token_ep, {
                'email': this.user.email,
                'token': this.credentials.loginToken
            })
                .then(response => {
                    // Gerer la réponse
                    if (response.status === 200) {
                        sessionStorage.setItem('authToken', response.data.token);
                        authentication.mail_sent = false;
                        authentication.credentials.loginToken = '';
                        authentication.credentials.authToken = response.data.token;
                        authentication.get_user();
                    }
                })
                .catch(error => {
                    console.log("Error :", error.response.data);
                    authentication.credentials.loginToken = "";
                    this.isAuthenticated = false ;
                })
        },
        get_user: function () {
            axios.get(API_ROOT + this.get_user_ep, {
                headers: {
                    Authorization: 'Token ' + this.credentials.authToken
                }
            })
                .then(response => {
                    // Gerer la réponse
                    if (response.status === 200) {
                        authentication.user.email = response.data.email;
                        this.user = response.data;
                        this.isAuthenticated = true;
                        bikeList.refresh_bike_list();
                    }
                })
                .catch(error => {
                    console.log("Error :", error.response);
                    if (error.response.status===401) {
                        sessionStorage.removeItem('authToken');
                        this.credentials.authToken = '';
                        this.isAuthenticated = false;
                    }
                })
        },
        log_out: function() {
            sessionStorage.removeItem('authToken');
            this.isAuthenticated = false;
            this.credentials = {
                loginToken: '',
                authToken: '',
            };
            this.user = {
                email: '',
                phone: '',
                username: '',
            };
            bikeList.refresh_bike_list();
        },
        switch_edition: function() {
            this.open_edition = !this.open_edition;
        },
        edit_informations: function() {
            axios.patch(API_ROOT + this.get_user_ep, this.user, {
                headers: {
                    Authorization: 'Token ' + this.credentials.authToken
                }
            })
                .then(response => {
                    authentication.user = response.data;
                })
        }
    }
});

var bikeList = new Vue({
    el: "#bikeList",
    data: {
        bikeList: [],
        new_bike: {
            name:'',
            robbed:false,
            reference:'',
            picture:'',
        },
        endpoints: {
            bikeListEp: "owner/bike_list/",
            patch_bike: "owner/bike_update/"
        },
        appending: false,
    },

    methods: {
        handleFileUpload: function() {
            bikeList.new_bike.picture = bikeList.$refs.picture.files[0];
        },
        switch_appending: function() {
            bikeList.appending = !bikeList.appending;
        },
        refresh_bike_list: function() {
            this.bikeList = [];
          axios.get(API_ROOT + this.endpoints.bikeListEp, {
              headers: {
                  Authorization: "Token "+ authentication.credentials.authToken
              }
          })
              .then(response => {
                  console.log(response);
                  response.data.forEach(function(item) {
                      bikeList.bikeList.push({
                          name: item.name,
                          reference: item.reference,
                          picture: item.picture,
                          robbed: item.robbed,
                          pk: item.pk,
                      })
                  });
              })
              .catch(error => {
                  console.log(error)
              })
        },
        register_bike: function(){
            let formData = new FormData();
            formData.append('name', bikeList.new_bike.name);
            formData.append('robbed', bikeList.new_bike.robbed);
            formData.append('reference', bikeList.new_bike.reference);
            formData.append('picture', bikeList.new_bike.picture);

            axios.post(API_ROOT + this.endpoints.bikeListEp, formData, {
                headers: {
                    'Authorization': "Token " + authentication.credentials.authToken,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    bikeList.refresh_bike_list();
                    bikeList.new_bike = {
                        name:'',
                        robbed:false,
                        reference:'',
                        picture: '',
                    };
                    bikeList.appending = false;

                })
        },
        change_robbed: function(id){
            let bike = bikeList.bikeList[id];
            let robbed = !bike.robbed;
            let message = '';
            if (bike.robbed === false) {
                message = "Voulez-vous déclarer " + bike.name + " volé ?"
            } else {
                message = "Voulez-vous déclarer avoir retrouvé ce vélo : " + bike.name
            }
            let confirmed = window.confirm(message);
            let location = getUserCoordinates();
            // TODO : Could clarify bike targeted in url.
            if (confirmed) {
                axios.patch(API_ROOT + this.endpoints.patch_bike + bike.pk + "/", {
                    robbed: robbed,
                    robbed_location: location,
                }, {
                    headers: {
                        Authorization: "Token " + authentication.credentials.authToken
                    }
                })
                    .then(response => {
                        console.log(response);
                        bikeList.refresh_bike_list();
                    })
            } else {
                console.log("Abort");
            }
        }
    }

});

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
};

function getUserCoordinates() {
    let coords = {
        lat:'',
        lon:'',
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            coords.lat = position.coords.latitude;
            coords.lon = position.coords.longitude;
        }, handle_error)
    } else {
        handle_error();
    }

    return coords;

    function handle_error() {
        coords.lat = 48.852969;
        coords.lon = 2.349903;
    }
};
