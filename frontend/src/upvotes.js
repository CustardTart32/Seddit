import { get_user_info } from "./user_services.js";
import API_URL from "./backend_url.js";
import {get_post_data} from "./post_services.js"

//This page handles all things upvotes with exception of loading upvote feed

function fill_upvote_modal (auth_token,element) {
    let body = document.getElementsByClassName("modal-content")[0];

    while(body.childElementCount > 1) {
        //console.log(body.lastElementChild);
        body.removeChild(body.lastElementChild);
    }

    //Creating Text in modal window
    let header = document.createElement("h2");
    header.setAttribute("class","header");
    header.appendChild(document.createTextNode("Post was upvoted by:"))
    body.appendChild(header);

    let list = document.createElement("ul");
    list.setAttribute("id","upvote-list");

    let post_data = get_post_data(auth_token,element["id"]);
    post_data.then(response => {
        for (let i = 0; i < response.meta.upvotes.length; i++) {
            let node = document.createElement("li");
    
            let user_data = get_user_info(auth_token,'',response.meta.upvotes[i]);
    
            user_data.then(response => {
                node.appendChild(document.createTextNode(response["name"]));
                return;
            })
            list.appendChild(node);
        }
    })

    body.appendChild(list);
    return;
}

function user_upvote (auth_token,id,button) {
    let url = API_URL + "/post/vote?id=" + id;
     
    let options = {
        method: "PUT",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : "Token " + auth_token
        },
    }

    //console.log(url);

    fetch(url,options)
    .then(response => {
        return response.json();
    })
    .then(myJson => {
        if(myJson["message"] !== "success") {
            alert(myJson["message"]);
        }
        else {
            let post_data = get_post_data(auth_token,id);
            post_data.then(response => {
                //console.log(response.meta.upvotes.length);
                button.removeChild(button.firstChild);
                button.appendChild(document.createTextNode(response.meta.upvotes.length));
                //console.log(button.firstChild);
            })
        }
    })
    return;
}

//For some weird reason, the server returns malformed requests when attempting to downvote
//an already downvoted post 
function user_downvote (auth_token,id,button) {
    let url = API_URL + "/post/vote?id=" + id;

    let options = {
        method: "DELETE",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : "Token " + auth_token
        },
    }

    fetch(url,options)
    .then(response => {
        return response.json();
    })
    .then(myJson => {
        let post_data = get_post_data(auth_token,id);
        post_data.then(response => {
            //console.log(response);
            
            button.removeChild(button.firstChild);
            button.appendChild(document.createTextNode(response.meta.upvotes.length));
        })
    })
    return;    
}


export{fill_upvote_modal,user_upvote,user_downvote};
