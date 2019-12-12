//This page handles all private profile requests

import {get_user_feed,get_user_info} from './user_services.js '
import {fill_account_profile} from './public_profile.js'


function create_private_profile (auth_token) {
    let user_data = get_user_info(auth_token,'','');
    user_data.then(response => {
        //console.log(response);
        fill_account_profile(response,auth_token,1);
        create_followed_table(auth_token);
    })

    return;
}


function create_followed_table (auth_token) {
    let body = document.getElementsByClassName("modal-content")[0];

    let title = document.createElement("h3");
    title.appendChild(document.createTextNode("Accounts Followed:"));
    title.setAttribute("class","followed-header");
    body.appendChild(title);
    
    let table = document.createElement("table");
    let row = document.createElement("tr");
    let col_1 = document.createElement("td");
    let col_2 = document.createElement("td");

    row.appendChild(col_1);
    row.appendChild(col_2);
    table.appendChild(row);

    let list_1 = document.createElement("ul");
    let list_2 = document.createElement("ul");
    
    let num_posts = get_num_posts(auth_token,0);
    num_posts.then(response => {
        let name_array = [];
        if (response !== 0) {
            let feed = get_user_feed(auth_token,0,response);
            feed.then(response => {
                response.posts.forEach(element => {
                    name_array.push(element.meta.author);
                });

                let single_array = [];
                name_array.forEach(element => {
                    if (single_array.includes(element) == false) {
                        single_array.push(element);
                    }
                });
                
                console.log(single_array);
                for (let i = 0; i < single_array.length; i++) {
                    let node = document.createElement("li");
                    node.appendChild(document.createTextNode(single_array[i]));

                    if (i < single_array.length/2) {
                        list_1.appendChild(node);
                    }
                    else {
                        list_2.appendChild(node);
                    }
                }

                col_1.appendChild(list_1);
                col_2.appendChild(list_2);
            })
        }
    })


    body.appendChild(table);
    return;
}

function get_num_posts (auth_token,i) {
    let feed = get_user_feed(auth_token,i,10);
    return feed.then(response => {
        if (response.posts.length !== 10) {
            return i + response.posts.length;
        }
        else {
            return get_num_posts(auth_token,i+10);
        }
    })
}

export {create_private_profile}