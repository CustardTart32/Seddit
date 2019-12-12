/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import {init_login_rego} from './create_login_rego.js';
import {load_recent_feed} from './feed.js';

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {  
  let url = apiUrl;
  
  let login_button = document.getElementsByClassName("button button-primary")[0];

  let reg_button = document.getElementsByClassName("button button-secondary")[0];

  init_login_rego(login_button,reg_button,apiUrl);

  load_recent_feed();
}


export default initApp;

