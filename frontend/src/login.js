//This page deals with login requests

import {load_user_feed} from "./feed.js";
import {set_user_profile} from './profile.js'
import API_URL from './backend_url.js';

function login(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        var payload = {
          username: document.forms["login"]["username"].value,
          password: document.forms["login"]["password"].value
        }
  
        let options = {
          method: "POST",
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(payload)
        }
  
        let fetch_status = 0;
        fetch(API_URL + "/auth/login", options)
          .then(response => {
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
              
              load_user_feed(auth_token);
              collape_login();
              set_user_profile(auth_token);
              save_auth_token(auth_token);
            }
            else {
              console.log(myJson);
              alert(myJson["message"]);
            }
          });
      });    
}

function collape_login() {
  let main = document.getElementsByTagName("main");
  console.log("Removing login form");
  if (main[0].firstElementChild.id == "login") {
    main[0].removeChild(main[0].firstElementChild);
  } 
  return;
}

function save_auth_token (auth_token) {
  let foooter = document.getElementsByTagName("footer")[0];
  //console.log(foooter);

  let id = document.createElement("p");
  id.appendChild(document.createTextNode(auth_token));
  id.setAttribute("id","token");
  foooter.appendChild(id);

  return;
}


export {login};