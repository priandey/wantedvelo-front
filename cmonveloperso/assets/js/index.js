let params = (new URL(document.location)).searchParams;
let user = params.get("u");

var APIURL = "http://127.0.0.1:8000";

if(user===null){
    console.log("Invalid User");
} else {
    console.log(user);
}