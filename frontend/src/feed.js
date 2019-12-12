import { fill_upvote_modal, user_upvote,user_downvote} from "./upvotes.js";
import {fill_comment_modal} from "./comments.js";
import API_URL from './backend_url.js';
import {get_user_feed } from './user_services.js'
import {fill_post_modal} from './post_message.js'
import {create_public_profile} from './public_profile.js'

//This page handles all things related to rendering feeds

//BASE FUNCTION FOR LOADING RECENT FEED
function load_recent_feed (logged_in = 0, auth_token) {
    let header = document.getElementsByClassName("feed-title alt-text")[0];
    header.removeChild(header.firstChild);
    header.appendChild(document.createTextNode("Popular Posts"));
    
    console.log("Loading recent feed");
    let main = document.getElementById("feed");

    //Removes all but the first node 
    while (main.childElementCount > 1) {
        main.removeChild(main.lastChild);
    }

    load_public_feed(logged_in,auth_token);

    return;
}

//BASE FUNCTION FOR LOADING USER FEED
function load_user_feed(auth_token) {
    let header = document.getElementsByClassName("feed-title alt-text")[0];
    header.removeChild(header.firstChild);
    header.appendChild(document.createTextNode("Your Feed"));

    let popular_button = document.createElement("button");
    popular_button.setAttribute("class","button button-feed");
    popular_button.appendChild(document.createTextNode("Popular"));

    let nav = document.getElementsByClassName("nav")[0];
    let banner = document.getElementsByClassName("banner")[0];
    banner.insertBefore(popular_button, nav);
    
    let feed = get_user_feed(auth_token,'','');
    feed.then(response => {
        //console.log(response);
        if (response["posts"].length !== 0) {
            console.log("Creating personal user feed");
            create_feed(response["posts"], 1,auth_token);
            

            //Continuous loading of user feed
            window.addEventListener("scroll", append_feed);

        }
        else {
            load_recent_feed(1,auth_token);
        }
    })
    
    return;
}

function load_public_feed (logged_in,auth_token) {
    let feed = document.getElementById("feed");
    let url = API_URL + "/post/public";

    let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    let promise = fetch(url,options) 
   
    let spinner = document.createElement("div");
    spinner.setAttribute("class","loader");
    feed.appendChild(spinner);
    

    promise.then(response => response.json())
    .then(myJson => {
        feed.removeChild(feed.lastElementChild);
        //console.log(myJson);
        create_feed(myJson["posts"],logged_in,auth_token);
    })
    return;
}

function create_feed (feed,logged_in,auth_token) {
    let main = document.getElementById("feed");

    //Removes all but the first node 
    while (main.childElementCount > 1) {
        main.removeChild(main.lastChild);
    }


    load_feed(feed,main,logged_in,auth_token);

    return;
}


function load_feed(my_feed,main,logged_in,auth_token) {
    //Loading feed
    load_message_button(main,auth_token,logged_in);

    my_feed.forEach(element => {
        let list_node = document.createElement("li");
        list_node.setAttribute("class","post");
        let attr = document.createAttribute("data-id-post");
        list_node.setAttributeNode(attr);
        list_node.setAttribute("id",element["id"]);
    
        create_upvotes(element,list_node,logged_in,auth_token);
       
        let content = document.createElement("div");
        content.setAttribute("class","content");
    
        create_title(element,content)
        create_author_subseddit(element,content,logged_in,auth_token);
        list_node.appendChild(content);
    
        create_date(element,list_node);
        create_text(element,list_node);
        load_image(element,list_node);
        load_comment_banner(element,list_node,logged_in,auth_token);
    
        main.appendChild(list_node);
    });
    return;
}

function load_message_button (main,auth_token,logged_in) {
    let feed_header = main.firstElementChild;

    if (feed_header.lastElementChild.className === "button button-secondary") {
        feed_header.removeChild(feed_header.lastElementChild);   
    }
    
    if (logged_in === 1) {
        //Create button and set event listner
        let button = document.createElement("button");
        button.setAttribute("class","button button-secondary");
        button.appendChild(document.createTextNode("Post"));
        feed_header.appendChild(button);
        

        button.addEventListener("click", (event) => {
            event.preventDefault;

            //Function that takes in auth_token to create post form
            let modal = document.getElementById("myModal");
            modal.style.display = "block";
            fill_post_modal(auth_token);
        })
    }
    
    return;
}

function create_upvotes(element,list_node,logged_in,auth_token) {
    let upvotes = document.createElement("div");
    upvotes.setAttribute("class","vote");
    let attr = document.createAttribute("data-id-upvotes");
    upvotes.setAttributeNode(attr);

     //Show number of votes and create event handler to show users who upvoted
     let votes = document.createElement("p");
     votes.setAttribute("class","num");
     votes.appendChild(document.createTextNode(element.meta.upvotes.length));
     if (logged_in == 1) {
         votes.addEventListener("click",(event) => {
             event.preventDefault;
             fill_upvote_modal(auth_token,element);
             
             let modal = document.getElementById("myModal");
             modal.style.display = "block";
         })
     }
     upvotes.appendChild(votes);


    //Create upvote button
    let arrow_up = document.createElement("i");
    arrow_up.setAttribute("class","material-icons arrow");
    arrow_up.appendChild(document.createTextNode("arrow_drop_up"));
    if (logged_in == 1) {
        arrow_up.addEventListener("click",(event) => {
            event.preventDefault;
            //console.log(element);
            user_upvote(auth_token,element["id"],votes);
        }) 
    }
    upvotes.insertBefore(arrow_up,votes);
    

    //Create downvote arrow
    let arrow_down = document.createElement("i");
    arrow_down.setAttribute("class","material-icons arrow");
    arrow_down.appendChild(document.createTextNode("arrow_drop_down"));
    if (logged_in == 1) {
        arrow_down.addEventListener("click", (event) => {
            event.preventDefault();
            //console.log(element)
            user_downvote(auth_token,element["id"],votes);
        })
    }
    upvotes.appendChild(arrow_down);

    list_node.appendChild(upvotes);
    return;
}

function create_title(element,content) {
    //Title
    let title = document.createElement("h4");
    let attr = document.createAttribute("data-id-title");
    title.setAttributeNode(attr);
    title.setAttribute("class","post-title alt-text");
    title.appendChild(document.createTextNode(element.title));
    content.appendChild(title);
}

function create_author_subseddit (element,content,logged_in,auth_token) {
    //Author and Subreddit 
    let author = document.createElement("div");
    author.setAttribute("class","post-author");
    
    let attr = document.createAttribute("data-id-author");
    author.setAttributeNode(attr);
    
    let subreddit = document.createElement("a");
    subreddit.setAttribute("class","post-subseddit");
    if (element.meta.subseddit === '') {
        subreddit.appendChild(document.createTextNode("s/all"));
    } else {
        subreddit.appendChild(document.createTextNode("s/" + element.meta.subseddit));
    }
    subreddit.appendChild(document.createTextNode(" . "));
    author.appendChild(subreddit);
    
    let name = document.createElement("div");
    name.appendChild(document.createTextNode("Posted by " + element.meta.author));
    name.setAttribute("class","post-author-name")

    //Create Public Profile Page event handler
    if (logged_in === 1) {
        name.addEventListener("click", (event) => {
            event.preventDefault();

            //Show Public Profile
            create_public_profile(element,auth_token);
            let modal = document.getElementById("myModal");
            modal.style.display = "block";
        })
    }

    author.appendChild(name);
    content.appendChild(author);
    return;
}

function create_date (element,list_node) {
    //Date Posted 
    let date_posted = convert_unix_time(element.meta.published);
    let date = document.createElement("div");
    date.setAttribute("class","post-date");
    date.appendChild(document.createTextNode(date_posted));
    list_node.appendChild(date);
    return;
}

function create_text (element,list_node) {
    //Post Text
    let post = document.createElement("div");
    post.setAttribute("class","post-text");
    let post_text = document.createElement("p");
    post_text.appendChild(document.createTextNode(element.text));
    post.appendChild(post_text);
    list_node.appendChild(post);   
}

function load_image (element,list_node) {
    //Load Image if there is one
    if (element.image != null) {
        let img = document.createElement("img");

        let img_b64 = "data:image/png;base64, " + element.image;
        img.setAttribute("src",img_b64);
        list_node.appendChild(img);
    }
}

function load_comment_banner (element,list_node,logged_in,auth_token) {
    //Create Comments 
    let comments = document.createElement("div");
    comments.setAttribute("class","post-comments");
    let num_comments = element.comments.length;

    comments.appendChild(document.createTextNode(num_comments + " Comment(s)"));

    //Make Comment Button
    let comment_button = document.createElement("div");
    comment_button.setAttribute("class","post-comment-button");

    let button = document.createElement("i");
    button.setAttribute("class","material-icons");
    button.appendChild(document.createTextNode("insert_comment"));

    if (logged_in == 1) {
        button.addEventListener("click",(event) => {
            event.preventDefault;

            //Format modal to show comments
            fill_comment_modal(auth_token,element);

            let modal = document.getElementById("myModal");
            modal.style.display = "block";
        })
    }


    comment_button.appendChild(button);
    comments.appendChild(comment_button);

    list_node.appendChild(comments);
    return;
}

function compare( a, b ) {
    if ( a.meta.published < b.meta.published ){
      return 1;
    }
    if ( a.meta.published > b.meta.published ){
      return -1;
    }
    return 0;
}

function convert_unix_time (unix_time) {
    var time = new Date(unix_time * 1000);
    
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = time.getFullYear();
    var month = months[time.getMonth()];
    var date = time.getDate();
    var hour = time.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var min = time.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var sec = time.getSeconds();
    if (sec < 10) {
        sec = '0' + sec;
    }

    var formattedTime = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

    return formattedTime;
}

let loaded_page = false;

const append_feed = () => {
    if (window.scrollY + 1500 > document.body.scrollHeight) {
        if (!loaded_page) {
            let num_posts = document.getElementsByClassName("post").length;
            let auth_token = document.getElementById("token").textContent;
            let main = document.getElementById("feed");

            //console.log(document.getElementsByClassName("post"));
            console.log(num_posts);

            let feed = get_user_feed(auth_token,num_posts,4);
            feed.then(response => {
                //console.log(response);
                if (response["posts"].length !== 0) {
                    //console.log("Adding " + response["posts"].length + " more things");
                    load_feed(response["posts"], main, 1,auth_token);    
                }
                else {
                    if (main.lastElementChild.tagName !== "H4") {
                        let end_message = document.createElement("h4");
                        end_message.appendChild(document.createTextNode("End of feed"));
                        end_message.setAttribute("id","end_message");
                        main.appendChild(end_message);
                    }
                }
            });
            //console.log("Set to true");
            loaded_page = true;
        }
    }
    else {
        //console.log("Set to false");
        loaded_page = false;
    }
        
        

    return;
}

export {load_recent_feed, load_user_feed,convert_unix_time,compare,append_feed};