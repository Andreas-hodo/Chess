const firebaseConfig = {
    apiKey: "AIzaSyCvgR3gFBBXLEmpCo3QpWtDEanrKE5eKk0",
    authDomain: "chess-game-f80e8.firebaseapp.com",
    databaseURL: "https://chess-game-f80e8-default-rtdb.firebaseio.com",
    projectId: "chess-game-f80e8",
    storageBucket: "chess-game-f80e8.appspot.com",
    messagingSenderId: "506835047675",
    appId: "1:506835047675:web:0c7f9a6d572cd3198c4c5e",
    measurementId: "G-CD15BNC8YZ"
  };
  //Initialize firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const users_data = db.collection("usersDetails");
