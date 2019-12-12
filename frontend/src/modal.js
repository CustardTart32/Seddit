//This file handles the generic functions for modal windows 

//Creates Empty Modal 
function create_modal (node) {
    let modal = document.createElement("div");
    modal.setAttribute("id","myModal");
    modal.setAttribute("class","modal");

    //Creating Content for modal window
    let modal_content = document.createElement("div");
    modal_content.setAttribute("class","modal-content");

    //Creating cross for closing window
    let span = document.createElement("span");
    span.setAttribute("class","close");
    let cross = document.createElement("i");
    cross.setAttribute("class","material-icons");
    cross.appendChild(document.createTextNode("close"));
    span.appendChild(cross);
    modal_content.appendChild(span);

    modal.appendChild(modal_content);
    node.insertBefore(modal,node.firstElementChild);

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
    return modal;
}

function delete_modal() {
    let body = document.getElementsByTagName("body")[0];
    body.removeChild(body.firstElementChild);

    return;
}

export {create_modal,delete_modal}