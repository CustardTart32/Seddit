//This page handles all user infomation requests with the exception of recent feed requests

import API_URL from './backend_url.js';

function get_user_info (auth_token,username,id) {
    let url = API_URL + "/user";

    if (username !== '' &&  id !== '') {
        url += '?username=' + username + '&id=' + id;
    }
    else if (username !== '') {
        url += '?username=' + username ;
    }
    else if (id !== '') {
        url += '?id=' + id;
    }

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

function get_user_feed(auth_token,p,n) {
    let url = API_URL + "/user/feed";

    if (p !== '' && n !== '') {
        url += "?p=" + p + "&n=" + n;
    }
    else if (p !== '') {
        url += "?p=" + p;
    }
    else if (n !== '') {
        url += "?n=" + n;
    }


    let options = {
        method: "GET",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : "Token " + auth_token
        },
    }

    return fetch(url,options)
        .then(response => response.json())
        .then(myJson => {
            return myJson;
        })
}

function update_user_info (auth_token) {
    let url = API_URL + "/user/";
    
    let email_input = document.forms["profile-form"]["email"].value;
    let name_input = document.forms["profile-form"]["name"].value;
    let password_input = document.forms["profile-form"]["password"].value;

    if (email_input === "") {
        email_input = null;
    }
    if (name_input === "") {
        name_input = null;
    }
    if (password_input === "") {
        password_input = null;
    }

    let payload = {
        email: email_input,
        name: name_input,
        password: password_input
    }

    console.log(payload);    
    let options = {
        method: "PUT",
        headers: {
            'Content-Type' : 'application/json',
            "Authorization" : "Token " + auth_token
        },
        body: JSON.stringify(payload)
    }

    return fetch(url,options) 
        .then(response => response.json())
        .then(myJson => {
            //console.log(myJson);
            return myJson;
        })
}

function follow (auth_token,username) {
    let url = API_URL + "/user/follow?username=" + username;

    let options = {
        method: "PUT",
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

function unfollow (auth_token,username) {
    let url = API_URL + "/user/unfollow?username=" + username;

    let options = {
        method: "PUT",
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

export{get_user_info,get_user_feed, update_user_info,follow,unfollow}