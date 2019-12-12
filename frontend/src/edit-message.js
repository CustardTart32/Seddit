//This page handles editing messages

import API_URL from './backend_url.js'
import {get_post_data} from './post_services.js'
import {create_private_profile} from './private_profile.js'
import { load_user_feed } from './feed.js';
 
//This message posts a message if no image is passed in
function fill_edit_modal (auth_token,id) {
    let body = document.getElementsByClassName("modal-content")[0];

    //Clearing Existing Modal 
    while(body.childElementCount > 1) {
        body.removeChild(body.lastElementChild);
    }

    //Creating Text in modal window
    let header = document.createElement("h2");
    header.setAttribute("class","header");
    header.appendChild(document.createTextNode("Edit Message"));
    body.appendChild(header);

    //Creating form to post message 
    let message_form = document.createElement("form");
    message_form.setAttribute("id","message-form");
    message_form.setAttribute("name","form");

    //Title Input
    let title_box = document.createElement("div");
    title_box.appendChild(document.createTextNode("Title"));
    title_box.appendChild(document.createElement("br"));
    title_box.setAttribute("class","message-input")

    let title_input = document.createElement("input");
    title_input.setAttribute("type","text");
    title_input.setAttribute("class","search");
    title_input.setAttribute("name","title");
    title_input.required = true;
    title_box.appendChild(title_input);
    message_form.appendChild(title_box);

    //Text Input
    let text_box = document.createElement("div");
    text_box.appendChild(document.createTextNode("Text"));
    text_box.appendChild(document.createElement("br"));
    text_box.setAttribute("class","message-input");

    let text_input = document.createElement("textarea");
    text_input.setAttribute("class","text-box")
    text_input.setAttribute("form","message-form");
    text_input.setAttribute("name","text");
    text_input.required = true;
    text_box.appendChild(text_input);
    message_form.appendChild(text_box);

    //Image Input
    let img_box = document.createElement("div");
    img_box.appendChild(document.createTextNode("Upload picture"));
    img_box.appendChild(document.createElement("br"));
    img_box.setAttribute("class","message-input");

    let img_input = document.createElement("input");
    img_input.setAttribute("type","file");
    img_input.setAttribute("class","search");
    img_input.setAttribute("name","image");
    img_box.appendChild(img_input);
    message_form.appendChild(img_box);

    //Submit button
    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Post Message"));
    button.setAttribute("class","button button-secondary");
    button.setAttribute("type","submit");
    message_form.appendChild(button);

    let post_data = get_post_data(auth_token,id);
    post_data.then(response => {
        title_input.setAttribute("placeholder",response.title);
        text_input.setAttribute("placeholder",response.text);
    })


    message_form.addEventListener("submit", (event) => {
        event.preventDefault();
        edit_message(auth_token,id);
    });


    body.appendChild(message_form);

    return;
}

//This message edits a message if no image is passed in
function edit_message (auth_token,id) {
    let url = API_URL + "/post/" + "?id=" + id;
    
    let img = document.forms["message-form"]["image"].files[0];
    console.log(img);
    if (img === undefined) {
        let payload = {
            title: document.forms["message-form"]["title"].value,
            text: document.forms["message-form"]["text"].value,
            image: null
        }

        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : "Token " + auth_token
            },
            body: JSON.stringify(payload)
        }

        let success = 0;
        fetch(url,options)
        .then(response => {
            if (response.status === 200) {
                success = 1;
            }
            return response.json();
        })
        .then(myJson => {
            console.log(myJson);
            if (success === 0) {
                alert(myJson["message"]);
            }
            else {
                console.log("success");
                create_private_profile(auth_token);
                load_user_feed(auth_token);
            }
        })
    }
    else {   
        edit_message_with_img(img,auth_token,id); 
    }
    
    return;
}

function edit_message_with_img(img,auth_token,id){
    let url = API_URL + "/post/" + "?id=" + id;
    var reader  = new FileReader();
    //console.log(auth_token);

    reader.onloadend = function () {
        let payload = {
            title: document.forms["message-form"]["title"].value,
            text: document.forms["message-form"]["text"].value,
            image: reader.result.replace('data:image/png;base64,', '')
        }

        //console.log(payload);
        let options = {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : "Token " + auth_token
            },
            body: JSON.stringify(payload)
        }

        let success = 0;
        fetch(url,options)
        .then(response => {
            if (response.status === 200) {
                success = 1;
            }
            return response.json();
        })
        .then(myJson => {
            if (success === 0) {
                alert(myJson["message"]);
            }
            else {
                console.log("Success");
                create_private_profile(auth_token);
                load_user_feed(auth_token);
            }
        })
    }

    reader.readAsDataURL(img); //reads the data as a URL
}

export {fill_edit_modal}