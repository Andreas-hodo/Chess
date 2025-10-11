let btn = document.getElementById("verifybtn")
btn.addEventListener("click", async ()=>{
    const auth = firebase.auth();
    const user = auth.currentUser;
    if (user) {
        try {
            // Force a reload of the user's profile data from Firebase backend
            await user.reload();
            // Force a refresh of the ID token to get updated claims
            const idTokenResult = await user.getIdTokenResult(true); // 'true' forces refresh
            console.log("Token:",idTokenResult)
            console.log("User:",user)
            if (user.emailVerified) {
                console.log("Email is now verified on this device!");
                alert("Your email has been verified! Redirecting to dashboard...");
                window.location.href = 'https://andreas-hodo.github.io/Chess/games/'; // Redirect to a protected page
            } else {
                console.log("Email is still not verified. Please check your inbox.");
                alert("Still waiting for verification. Have you clicked the link in your email?");
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            alert("An error occurred while checking verification status. Please try again.");
        }
    } else {
        console.log("No user signed in.");
        alert("You need to be signed in to check verification status.");
        window.location.href = 'https://andreas-hodo.github.io/Chess/login/';
    }
auth.onAuthStateChanged((user)=>{
  if(user){
    console.log("Authentication status changed!!!!")
    console.log("User:",user)
}
})
})




