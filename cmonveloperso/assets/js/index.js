let params = (new URL(document.location)).searchParams;
let user = params.get("u");


if(user===null){
    console.log("Invalid User");
} else {
    console.log(user);
}