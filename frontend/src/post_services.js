//This page handles all things related to fetching individual posts (not feed)

import API_URL from './backend_url.js';

function get_post_data(auth_token,id) {
    let url = API_URL + "/post/?id=" + id;

    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : "Token " + auth_token
        }
    }

    return fetch(url,options)
        .then(response => response.json())
        .then(myJson => {
            //console.log(myJson);
            return myJson;
        })
}

function delete_post (auth_token,id) {
    let url = API_URL + "/post/" + "?id=" + id;

    let options = {
        method: "DELETE",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : "Token " + auth_token
        }
    }

    return fetch(url,options)
        .then(response => response.json())
        .then(myJson => {
            return myJson;
        })
}

export {get_post_data,delete_post}