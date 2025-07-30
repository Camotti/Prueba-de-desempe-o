const buttonLogout= document.getElementById("logout"); //we take id's button from html document

    if (buttonLogout){ //check options 
        buttonLogout.addEventListener("click", ()=>  {
            localStorage.removeItem("currenteUser"); //Delete the local storage and the current user
            window.location.href ="../../index.html"; // redirect to the root document or index.
        });
    }

    