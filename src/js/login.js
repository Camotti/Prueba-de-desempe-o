//here we take id formlogin from the html
const formLogin = document.getElementById("formLogin")

formLogin.addEventListener("submit", function (event) { //this event function is like to react when user push submit
    


    const inputUsername = formLogin.userName.value
    const inputPassword = formLogin.password.value //Value save all the information from the inputs

    login(inputUsername, inputPassword)
 
   event.preventDefault() //avoid recharse the page while the user send information in the inputs
})

//post
async function login(inputUsername, inputPassword) {
    let response = await fetch(`http://localhost:3000/users?username=${inputUsername}`) //usa users?username= ${inputUsername} para hacer un filtro
    let data = await response.json()
    console.log(data)

    

    if (data.length === 0) {   //check the array
        alert('usuario no encontrado')

    } else {
        const userFound = data[0] //check the first and the only user 
        console.log(userFound)

        if (userFound.password === inputPassword) {  //check similitude between passwords a

            localStorage.setItem("currentUser", JSON.stringify(userFound)) //seItem permit save the object in pars key value
            window.location.href = "./src/views/dashboard.html"; //this line redirect to dashboard


        } else {
            alert("credenciales incorrectas, revisa el correo o la contraseña")
        }

    }
}
