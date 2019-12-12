//This page handles all operations when refering to the logout and profile buttons

import {create_modal,delete_modal} from './modal.js'
import {get_user_info,update_user_info} from './user_services.js'
import {load_recent_feed,append_feed} from './feed.js'
import {add_event_login,add_event_sign_up} from './create_login_rego.js'
import {create_private_profile} from './private_profile.js'
import {create_account_table} from './account.js'

//This Function sets the top ribbon whenever a user logs in
function set_user_profile (auth_token) {
    let nav = document.getElementsByClassName("nav");  
    //console.log("nav");

    while (nav[0].childElementCount > 1) {
        nav[0].removeChild(nav[0].lastElementChild);
    }

    //Create Button to Show Private Profile Page
    let li_node = document.createElement("li");
    li_node.setAttribute("class","nav-item");

    let account_button = document.createElement("button");
    account_button.setAttribute("class","button button-secondary");

    let user_data = get_user_info(auth_token,'','');
    user_data.then(response => {
        account_button.appendChild(document.createTextNode(response["username"]));
    })

    account_button.addEventListener("click", (event) => {
        event.preventDefault();
        
        //Show Private Profile
        create_private_profile(auth_token);

        let modal = document.getElementById("myModal");
        modal.style.display = "block";
    })

    li_node.appendChild(account_button);


    //Creating Button to Show Account Page 
    let profile = document.createElement("button");
    profile.setAttribute("class","button button-primary");
    profile.appendChild(document.createTextNode("My Account"));

    li_node.appendChild(profile)
    nav[0].appendChild(li_node);

    //Creating Multi-Purpose Modal
    let body = document.getElementsByTagName("body")[0];
    let profile_modal = create_modal(body);

    //Event listener that loads model with Profile Data
    profile.addEventListener("click", (event) => {
        event.preventDefault;
        //Function that fills modal window with profile data
        fill_modal_profile_data(auth_token);
        profile_modal.style.display = "block";
    })

    //Creating Logout Button
    li_node = document.createElement("li");
    li_node.setAttribute("class","nav-item");

    let log_out_button = document.createElement("button");
    log_out_button.appendChild(document.createTextNode("Log Out"));
    log_out_button.setAttribute("class","button button-tertiary");
    log_out_button.addEventListener("click", (event) => {
        event.preventDefault;
        log_out();
    })

    
    li_node.appendChild(log_out_button)
    nav[0].appendChild(li_node);

    return;
}

function log_out() {
    window.removeEventListener("scroll", append_feed);

    delete_modal();
    remove_feed_button();
    reset_account();
    load_recent_feed();
    remove_auth_token();

    return;
}

function remove_feed_button () {
    let banner = document.getElementById("nav");
    let popular_button = document.getElementsByClassName("button button-feed")[0];
    banner.removeChild(popular_button);

    return;
}

function fill_modal_profile_data (auth_token) {
    let body = document.getElementsByClassName("modal-content")[0];

    while(body.childElementCount > 1) {
        //console.log(body.lastElementChild);
        body.removeChild(body.lastElementChild);
    }

    //Creating Text in modal window
    let text = document.createElement("h2");
    text.setAttribute("class","header");
    text.appendChild(document.createTextNode("My Profile Details"));
    body.appendChild(text);
    
    create_account_table(auth_token);
    return;
}

//This function resets the top ribbon on the event of a log out 
function reset_account () {
    let main = document.getElementsByTagName("main");
    let nav = document.getElementsByClassName("nav");
    
    while (nav[0].childElementCount > 1) {
        nav[0].removeChild(nav[0].lastElementChild);
    }

    //Creating Log In Button (Consider converting into function)
    let node = document.createElement("li");
    node.setAttribute("class","nav-item");

    let log_in_button = document.createElement("button");
    let attr = document.createAttribute("data-id-login");
    log_in_button.setAttributeNode(attr);
    log_in_button.setAttribute("class","button button-primary");
    log_in_button.appendChild(document.createTextNode("Log In"));
    node.appendChild(log_in_button);
    nav[0].appendChild(node);
    add_event_login(log_in_button,main);

    //Creating Sign Up Button (Consider converting into function)
    node = document.createElement("li");
    node.setAttribute("class","nav-item");

    let reg_button = document.createElement("button");
    attr = document.createAttribute("data-id-signup");
    reg_button.setAttributeNode(attr);
    reg_button.setAttribute("class","button button-secondary");
    reg_button.appendChild(document.createTextNode("Sign Up"));
    node.appendChild(reg_button);
    nav[0].appendChild(node);
    add_event_sign_up(reg_button,main);

    return;
}

function remove_auth_token () {
    let foooter = document.getElementsByTagName("footer")[0];

    foooter.removeChild(foooter.lastElementChild);
    return;
}


export {set_user_profile,fill_modal_profile_data}