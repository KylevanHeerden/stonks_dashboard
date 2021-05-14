import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvweBx_ogRMUT_DYzyqVqn8bx9_Qey7D0",
  authDomain: "stonks3.firebaseapp.com",
  projectId: "stonks3",
  storageBucket: "stonks3.appspot.com",
  messagingSenderId: "602236184137",
  appId: "1:602236184137:web:c7498adec11e878b174198",
  measurementId: "G-KZ0L2QFW0F",
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();

// collection references
const stonksCollection = db.collection("stonks");
const layoutCollection = db.collection("layout");

// export utils/refs
export { firebase, db, stonksCollection, layoutCollection };
