//This page initalises the login and sign-up buttons when first loaded

import {login} from './login.js'
import {register} from './register.js'

function init_login_rego (login_button,reg_button) {
  let main = document.getElementsByTagName("main");
  
  add_event_login(login_button,main);

  add_event_sign_up(reg_button,main);

  return;
}

function create_login_form() {
    let main_doc = document.getElementsByTagName("main");
    
    //Creating form
    let login_box = document.createElement("div");
    login_box.setAttribute("class","login");
    login_box.setAttribute("id","login");

    let form = document.createElement("form");
    form.setAttribute("name","login");

    create_user_password_boxes(form);

    //Creating button 
    let button = document.createElement("button");
    let attr = document.createAttribute("data-id-login");
    button.setAttributeNode(attr);
    button.setAttribute("type","submit");
    button.appendChild(document.createTextNode("Login"));
    button.setAttribute("class","button button-primary");

    form.appendChild(button);

    //Function to handle login requests 
    login(form);

    login_box.appendChild(form);

    main_doc[0].insertBefore(login_box, document.getElementById("feed"));
    return;
}

function create_registration () {
  let main_doc = document.getElementsByTagName("main");
  
  //Creating Registration Form 
  let reg_box = document.createElement("div");
  reg_box.setAttribute("class","reg");
  reg_box.setAttribute("id","login");

  let form = document.createElement("form");
  form.setAttribute("name","rego");

  create_user_password_boxes(form);
  create_email_name_boxes(form);

  //Creating button 
  let button = document.createElement("button");
  let attr = document.createAttribute("data-id-signup");
  button.setAttributeNode(attr);
  button.setAttribute("type","submit");
  button.appendChild(document.createTextNode("Register"));
  button.setAttribute("class","button button-secondary");

  form.appendChild(button);

  //Function to handle new user requests
  register(form);

  reg_box.appendChild(form);

  main_doc[0].insertBefore(reg_box, document.getElementById("feed"));
  return;
}

function create_user_password_boxes (form) {
  //Creating Username
  form.appendChild(document.createTextNode("Username - "));
  let username = document.createElement("input");
  username.setAttribute("type","text");
  username.setAttribute("name","username");
  username.required = true;
  form.appendChild(username);

  form.appendChild(document.createElement("br"));

  //Creating Password
  form.appendChild(document.createTextNode("Password - "));
  let password = document.createElement("input");
  password.setAttribute("type","text");
  password.setAttribute("name","password");
  password.required = true;
  form.appendChild(password);

  form.appendChild(document.createElement("br"));
  return;
}

function create_email_name_boxes (form) {
  //Creating email
  form.appendChild(document.createTextNode("Email - "));
  let email = document.createElement("input");
  email.setAttribute("type","text");
  email.setAttribute("name","email");
  email.required = true;
  form.appendChild(email);

  form.appendChild(document.createElement("br"));

  //Creating name input
  form.appendChild(document.createTextNode("Name - "));
  let name = document.createElement("input");
  name.setAttribute("type","text");
  name.setAttribute("name","name");
  name.required = true;
  form.appendChild(name);

  form.appendChild(document.createElement("br"));
  return;
}

function add_event_login (button,main) {
  button.addEventListener("click", () => {
    if (main[0].firstElementChild.id == "login") {
      if (main[0].firstElementChild.className == "reg") {
        main[0].removeChild(main[0].firstElementChild);
        create_login_form();
      }
    }
    else if (main[0].firstElementChild.id == "feed") {
      create_login_form();
    }
  })
  return;
}

function add_event_sign_up (button,main) {
  button.addEventListener("click", () => {
    if (main[0].firstElementChild.id == "login") {
      if (main[0].firstElementChild.className == "login") {
        main[0].removeChild(main[0].firstElementChild);
        create_registration();
      }
    }
    else if (main[0].firstElementChild.id == "feed") {
      create_registration();
    }
  })
  return;
}

export {init_login_rego,add_event_login,add_event_sign_up};