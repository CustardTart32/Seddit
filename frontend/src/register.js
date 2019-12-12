import {load_user_feed} from './feed.js';
import {set_user_profile} from './profile.js';
import API_URL from './backend_url.js';

function register(form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        var payload = {
            username: document.forms["rego"]["username"].value,
            password: document.forms["rego"]["password"].value,
            email: document.forms["rego"]["email"].value,
            name: document.forms["rego"]["name"].value
        }

        console.log(payload);

        let options = {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(payload)
        }

        let fetch_status = 0;
        fetch(API_URL + "/auth/signup",options)
        .then (response => {
            if (response.status === 200) {
                fetch_status = 1;
            }
            else {
                fetch_status = 0;
            }
            return response.json()
        })
        .then(myJson => {
            if (fetch_status === 1) {
                let auth_token = myJson["token"];
                console.log(auth_token);
                load_user_feed(auth_token,);
                collapse_rego();
                set_user_profile(auth_token);

              }
              else {
                console.log(myJson);
                alert(myJson["message"]);
              }
        })
    })
    
    return;
}

function validate_email (email) {
    return /\S+@\S+\.\S+/.test(email);
}

function collapse_rego () {
    let main = document.getElementsByTagName("main");
    console.log("Removing rego form");
    if (main[0].firstElementChild.id == "login") {
      main[0].removeChild(main[0].firstElementChild);
    } 
    return;
}

export {register,validate_email};