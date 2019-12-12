//This page allows handles all things comments
import {convert_unix_time, load_recent_feed, load_user_feed} from './feed.js'
import API_URL from './backend_url.js';
import { get_post_data } from './post_services.js';

function fill_comment_modal(auth_token,element) {
    //console.log(element);
    let body = document.getElementsByClassName("modal-content")[0];
    //console.log(document.getElementsByClassName("modal-content"));

    while(body.childElementCount > 1) {
        //console.log(body.lastElementChild);
        body.removeChild(body.lastElementChild);
    }

    //Creating Text in modal window
    let header = document.createElement("h2");
    header.setAttribute("class","header");
    header.appendChild(document.createTextNode("Comments"));
    body.appendChild(header);

    //Creating list for comments
    let comment_feed = document.createElement("ul");
    comment_feed.setAttribute("id","comments_feed");


    let post_data = get_post_data(auth_token,element["id"]);
    post_data.then(response => {
        response.comments.sort(compare_comment_time);

        response.comments.forEach(value => {
            let node = document.createElement("li");
            node.setAttribute("class","comment");
            
            let title = document.createElement("div");
            title.appendChild(document.createTextNode(value["author"]));
            title.setAttribute("class","comment-title");
            
            let time = document.createElement("div");
            time.setAttribute("class","comment-time")
            time.appendChild(document.createTextNode(convert_unix_time(value["published"])));
            title.appendChild(time);

            node.appendChild(title);

            let comment = document.createElement("div");
            comment.setAttribute("class","comment-text");
            comment.appendChild(document.createTextNode(value["comment"]));
            node.appendChild(comment);
            comment_feed.appendChild(node);
        });
    })

    body.append(comment_feed);    

    //Create Comment Form
    create_comment_form(auth_token,element);

    return;
}

function compare_comment_time (a,b) {
    if ( a.published < b.published ){
        return 1;
      }
      if ( a.published > b.published ){
        return -1;
      }
      return 0;
}

function create_comment_form (auth_token,element) {
    let body = document.getElementsByClassName("modal-content")[0];

    let comment_form = document.createElement("form");
    comment_form.setAttribute("id","comment-form");

    //Text Input
    let text_box = document.createElement("div");
    text_box.appendChild(document.createTextNode("New Comment"));
    text_box.appendChild(document.createElement("br"));
    text_box.setAttribute("class","message-input");

    let text_input = document.createElement("textarea");
    text_input.setAttribute("class","text-box")
    text_input.setAttribute("form","comment-form");
    text_input.setAttribute("name","comment");
    text_input.required = true;
    text_box.appendChild(text_input);
    comment_form.appendChild(text_box);

    //Submit button
    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Post Comment"));
    button.setAttribute("class","button button-secondary");
    button.setAttribute("type","submit");
    comment_form.appendChild(button);

    body.appendChild(comment_form);

    comment_form.addEventListener("submit", (event) => {
        event.preventDefault();
        //console.log(element);
        post_comment(auth_token,element);
    });

    return;
}

function post_comment(auth_token,element) {
    let url = API_URL + "/post/comment" + "?id=" + element["id"];
    
    let payload = {
        comment: document.forms["comment-form"]["comment"].value
    }

    let options = {
        method: "PUT",
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : "Token " + auth_token
        },
        body: JSON.stringify(payload)
    }

    fetch(url,options)
    .then(response => response.json())
    .then(myJson => {
        if (myJson["message"] !== "success") {
            alert(myJson["message"]);
        }
        else {
            fill_comment_modal(auth_token,element);
            update_comments_number(auth_token, element["id"],);
        }
    })

    return;
}

function update_comments_number (auth_token, id) {
    let post = document.getElementById(id);
    let banner = post.lastElementChild;
    
    banner.removeChild(banner.firstChild);
    
    let post_data = get_post_data(auth_token,id)
    post_data.then(response => {
        let text = document.createTextNode(response["comments"].length + " Comment(s)");
        banner.insertBefore(text,banner.lastElementChild);
    })

    return;
}

export {fill_comment_modal}