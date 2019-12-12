//This page handles public account profiles

import {get_user_info,follow, unfollow, get_user_feed} from './user_services.js'
import { get_post_data, delete_post } from './post_services.js';
import {convert_unix_time,compare,load_user_feed} from './feed.js';
import {fill_post_modal} from './post_message.js'
import { fill_edit_modal } from './edit-message.js';

function create_public_profile (element,auth_token) {
    //console.log(element.meta.author);

    let user_data = get_user_info(auth_token,element.meta.author,'');
    user_data.then(response => {
        //console.log(response);
        fill_account_profile(response,auth_token,0);
        
        //Create Follow and Unfollow button
        create_follow_unfollow(response,auth_token,element);
    })

    return;
}

function fill_account_profile (user_data,auth_token,logged_in) {
    let body = document.getElementsByClassName("modal-content")[0];

    while(body.childElementCount > 1) {
        //console.log(body.lastElementChild);
        body.removeChild(body.lastElementChild);
    }

    //Creating Text in modal window
    let text = document.createElement("h2");
    text.setAttribute("class","header");
    text.appendChild(document.createTextNode(user_data.name + "'s Details"));
    body.appendChild(text);

    create_profile_table(user_data);
    create_profile_posts(user_data,auth_token,logged_in);

    return;
}


function create_profile_posts (user_data,auth_token,logged_in) {
    let body = document.getElementsByClassName("modal-content")[0];

    let title = document.createElement("h3");
    title.appendChild(document.createTextNode(user_data.name + "'s Posts"));
    body.append(title);

    let post_feed = document.createElement("ul");
    post_feed.setAttribute("id","profile_feed");


    let fetch_data = [];
    user_data.posts.forEach(element => {
        //let post_data = get_post_data(auth_token,element);
        fetch_data.push(get_post_data(auth_token,element));
    });

    Promise.all(fetch_data)
        .then(fetch_data => {
            fetch_data.sort(compare);
        
            fetch_data.forEach(element => {
                let node = document.createElement("li");
                node.setAttribute("class","comment-profile");
                node.setAttribute("id",element.id);
                
                //console.log(logged_in);
                if (logged_in == 1) {
                    let banner = document.createElement("div");
                    banner.setAttribute("class","comment-banner");
                    node.appendChild(banner); 

                    let edit_icon =  document.createElement("i");
                    edit_icon.setAttribute("class","material-icons");
                    edit_icon.appendChild(document.createTextNode("edit"));
                    banner.appendChild(edit_icon);

                    edit_icon.addEventListener("click", (event) => {
                        event.preventDefault();

                        fill_edit_modal(auth_token,element.id);
                    })

                    let delete_icon = document.createElement("i");
                    delete_icon.setAttribute("class","material-icons");
                    delete_icon.appendChild(document.createTextNode("delete"));
                    banner.appendChild(delete_icon);

                    //Delete Icon
                    delete_icon.addEventListener("click", (event) => {
                        event.preventDefault();

                        let promise = delete_post(auth_token,element.id);
                        promise.then(response => {
                            if (response.message !== "success") {
                                alert(response.message);
                            }
                            else {
                                let data = get_user_info(auth_token,'','');
                                data.then(response => {                                
                                    fill_account_profile(response,auth_token,1);
                                })
                            }
                        })
                    })
                }

                let title = document.createElement("div");
                title.appendChild(document.createTextNode(element.title));
                title.setAttribute("class","comment-title");

                let time = document.createElement("div");
                time.setAttribute("class","comment-time")
                time.appendChild(document.createTextNode(convert_unix_time(element.meta.published)));
                title.appendChild(time);

                node.appendChild(title);

                let text = document.createElement("div");
                text.setAttribute("class","comment-text");
                text.appendChild(document.createTextNode(element.text));
                node.appendChild(text);
                
                post_feed.appendChild(node);
            });    
        })
    
    body.appendChild(post_feed);

    return;
}

function create_follow_unfollow(user_data,auth_token,element) {
    let body = document.getElementsByClassName("modal-content")[0];
    
    //Submit button
    let button = document.createElement("button");

    button.setAttribute("type","submit");
    body.appendChild(button);

    let promise = get_user_info(auth_token,'','');
    promise.then(response => {
        if (response.following.includes(user_data.id) == true) {
            button.appendChild(document.createTextNode("Unfollow"));
            button.setAttribute("class","button button-tertiary");
            button.addEventListener("click", (event) => {
                event.preventDefault();

                //Unfollow
                let promise = unfollow(auth_token,user_data.username);
                promise.then(response => {
                    if (response.message !== "success") {
                        alert(response.message);

                    }
                    else {
                        create_public_profile(element,auth_token);  
                        load_user_feed(auth_token);                  
                    }
                })

            })
        }
        else {
            button.appendChild(document.createTextNode("Follow"));
            button.setAttribute("class","button button-secondary");
            button.addEventListener("click", (event) => {
                event.preventDefault();

                //Follow
                let promise = follow(auth_token,user_data.username);
                promise.then(response => {
                    if (response.message !== "success") {
                        alert(response.message);
                    }
                    else {
                        create_public_profile(element,auth_token);
                        load_user_feed(auth_token);
                    }
                })
            })
        }
    })
    
    
    //console.log(followed);
    return;
}

function create_profile_table (user_data) {
    //console.log(user_data);
    
    let body = document.getElementsByClassName("modal-content")[0];
    
    let table = document.createElement("table");
    
    //Creating Name 
    let row = document.createElement("tr");
    let key = document.createElement("td");
    key.appendChild(document.createTextNode("Name"));
    row.appendChild(key);
    
    let value = document.createElement("td");
    value.appendChild(document.createTextNode(user_data["name"]));
    row.appendChild(value);

    table.appendChild(row);

    //Creating Num Followers
    row = document.createElement("tr");
    key = document.createElement("td");
    key.appendChild(document.createTextNode("Number of Followers"));
    row.appendChild(key);
    
    value = document.createElement("td");
    value.appendChild(document.createTextNode(user_data["following"].length));
    row.appendChild(value);

    table.appendChild(row);

    //Creating Num Following 
    row = document.createElement("tr");
    key = document.createElement("td");
    key.appendChild(document.createTextNode("Number of Followed Accounts"));
    row.appendChild(key);
    
    value = document.createElement("td");
    value.appendChild(document.createTextNode(user_data["followed_num"]));
    row.appendChild(value);
    
    table.appendChild(row);

    body.appendChild(table);
    
    return;
}


export {create_public_profile,fill_account_profile}