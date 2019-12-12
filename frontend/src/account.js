//This page handles all things related to accounts. 
import {validate_email} from './register.js'
import {get_user_info,update_user_info} from './user_services.js'
import {fill_modal_profile_data} from './profile.js'

function create_account_table(auth_token) {    
    let body = document.getElementsByClassName("modal-content")[0];
    
    let table = document.createElement("table");
    
    let user_data = get_user_info(auth_token,'','');
    user_data.then(response => {
        console.log(response);
        
        //Creating Email
        let row = document.createElement("tr");
        let key = document.createElement("td");
        key.appendChild(document.createTextNode("Email"));
        row.appendChild(key);

        let value = document.createElement("td");
        value.appendChild(document.createTextNode(response["email"]));
        row.appendChild(value);

        table.appendChild(row);

        //Creating Name
        row = document.createElement("tr");
        key = document.createElement("td");
        key.appendChild(document.createTextNode("Name"));
        row.appendChild(key);
        
        value = document.createElement("td");
        value.appendChild(document.createTextNode(response["name"]));
        row.appendChild(value);

        table.appendChild(row);

        //Creating Username
        row = document.createElement("tr");
        key = document.createElement("td");
        key.appendChild(document.createTextNode("Username"));
        row.appendChild(key);
        
        value = document.createElement("td");
        value.appendChild(document.createTextNode(response["username"]));
        row.appendChild(value);

        table.appendChild(row);

        //Creating Num Followers
        row = document.createElement("tr");
        key = document.createElement("td");
        key.appendChild(document.createTextNode("Number of Followers"));
        row.appendChild(key);
        
        value = document.createElement("td");
        value.appendChild(document.createTextNode(response["following"].length));
        row.appendChild(value);

        table.appendChild(row);

        //Creating Num Posts
        row = document.createElement("tr");
        key = document.createElement("td");
        key.appendChild(document.createTextNode("Number of Posts"));
        row.appendChild(key);
        
        value = document.createElement("td");
        value.appendChild(document.createTextNode(response["posts"].length));
        row.appendChild(value);

        table.appendChild(row);
        return;
    })
    body.appendChild(table);
    
    create_edit_button(auth_token);
    
    return;
}

function create_edit_button (auth_token) {
    let body = document.getElementsByClassName("modal-content")[0];

    let button = document.createElement("button");
    button.appendChild(document.createTextNode("Edit Profile Details"));
    button.setAttribute("class","button button-secondary");
    
    button.addEventListener("click", (event) => {
        event.preventDefault();

        create_edit_form(auth_token);
    })

    body.appendChild(button);

    return;
}

function create_edit_form (auth_token) {
    let body = document.getElementsByClassName("modal-content")[0];
    
    while(body.childElementCount > 1) {
        //console.log(body.lastElementChild);
        body.removeChild(body.lastElementChild);
    }
    
    let user_data = get_user_info(auth_token,'','');
    user_data.then(response => {
            //Creating Text in modal window
        let header = document.createElement("h2");
        header.setAttribute("class","header");
        header.appendChild(document.createTextNode("Edit Profile Details"));
        body.appendChild(header);

        //Creating form to post message 
        let profile_form = document.createElement("form");
        profile_form.setAttribute("id","profile-form");
        profile_form.setAttribute("name","profile-form");

        //Email Input 
        let email_box = document.createElement("div");
        email_box.appendChild(document.createTextNode("Email"));
        email_box.appendChild(document.createElement("br"));
        email_box.setAttribute("class","message-input");

        let email_input = document.createElement("input");
        email_input.setAttribute("type","text");
        email_input.setAttribute("class","search");
        email_input.setAttribute("name","email");
        email_input.setAttribute("placeholder",response.email)
        email_input.required == true;
        email_box.appendChild(email_input);
        profile_form.appendChild(email_box);

        //Name Input 
        let name_box = document.createElement("div");
        name_box.appendChild(document.createTextNode("Name"));
        name_box.appendChild(document.createElement("br"));
        name_box.setAttribute("class","message-input");

        let name_input = document.createElement("input");
        name_input.setAttribute("type","text");
        name_input.setAttribute("class","search");
        name_input.setAttribute("name","name");
        name_input.setAttribute("placeholder",response.name);
        name_input.required == true;
        name_box.appendChild(name_input);
        profile_form.appendChild(name_box);

        //Password Input 
        let password_box = document.createElement("div");
        password_box.appendChild(document.createTextNode("Password"));
        password_box.appendChild(document.createElement("br"));
        password_box.setAttribute("class","message-input");

        let password_input = document.createElement("input");
        password_input.setAttribute("type","text");
        password_input.setAttribute("class","search");
        password_input.setAttribute("name","password");
        password_input.required = true;
        password_box.appendChild(password_input);
        profile_form.appendChild(password_box);

        //Submit button
        let button = document.createElement("button");
        button.appendChild(document.createTextNode("Edit Profile"));
        button.setAttribute("class","button button-secondary");
        button.setAttribute("type","submit");
        profile_form.appendChild(button);

        body.appendChild(profile_form);

        profile_form.addEventListener("submit",(event) => {
            event.preventDefault();

            if (validate_email(document.forms["profile-form"]["email"].value) == false &&
            document.forms["profile-form"]["email"].value !== null) {
                alert("Invalid Email Address");
                return;
            }

            //Update profile details
            let message = update_user_info(auth_token);
            message.then(response => {
                if (response["msg"] === "success") {
                    fill_modal_profile_data(auth_token);
                }
                else {
                    alert(response["msg"]);
                }
            })
        })

        return;
    }) 

    return;
}

export {create_account_table}