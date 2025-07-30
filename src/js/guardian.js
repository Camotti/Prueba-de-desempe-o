//// This guardian function is to protect personal information if the user hasn't started session.
function checkSession() {

    let checkUser = localStorage.getItem("currentUser") //chel the user in the localstorage in console application by pars Key and Value .

    if (checkUser === null) {  // if the user if not found , the guardian will redirect to the login 
        window.location.href="index.html"
    }

}

checkSession()



 