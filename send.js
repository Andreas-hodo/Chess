const login = document.getElementById("login_form")
const signup = document.getElementById("signup_form")
const login_btn = document.getElementById("loginbtn") 
const signup_btn = document.getElementById("signupbtn")
login.addEventListener("submit",(e)=>{
    e.preventDefault()
    var all_usersnames = []
    var all_userspasswords = []
    const name = document.getElementById("username_login").value
    const password = document.getElementById("password_login").value 
     users_data.get()
     .then(snapshot => {
       snapshot.docs.forEach(doc => {
        all_usersnames.push(doc.data().name)
        all_userspasswords.push(doc.data().password)
       });
     }).then(() =>{
        if(all_usersnames.includes(name) && all_userspasswords.includes(password)){
             window.location = "rooms.html"
        }   
     })
     .catch(error => {
       console.error("Error getting documents: ", error);
     });   
})
signup.addEventListener("submit",(e)=>{
    e.preventDefault()
    var all_usersdata = []
    const name = document.getElementById("username_signup")
    const password = document.getElementById("password_signup")
    users_data.get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        all_usersdata.push(doc.data().name)
      });
    }).then(() =>{
        if(!all_usersdata.includes(name.value)){
           users_data.add({name:name.value,password:password.value})
      .then(() => {
        window.location = "rooms.html"
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
        }else{
            alert("This name is already taken")
            name.value = "" 
            password.value = ""
        }
    })
    .catch(error => {
      console.error("Error getting documents: ", error);
    }); 
})