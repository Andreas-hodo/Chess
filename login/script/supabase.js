const storage = supabase.createClient(
    "https://wzkllmyazrkywlzqgfmy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6a2xsbXlhenJreXdsenFnZm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTM2NjMsImV4cCI6MjA3ODg4OTY2M30.llOBw1c9J04q9QXYzJ6Mohrb6rJ_JfmRw0QQ5UOqVqk"
) 

// try {
//     let { data: supabaseAuthData, error: supabaseError } = await storage.auth.signUp({
//         email: "forsaek@gmail.com",
//         password: "",
//     });
//     }catch(error){
//     alert("An error has occured!")
//     console.log(error.message)
//     }
