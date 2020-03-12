import firebase from "firebase";
import "firebase/firestore";
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAL_CrobqM5dO-9nlZz7zfRbilFIO2mvOQ",
  authDomain: "movierevue-77901.firebaseapp.com",
  databaseURL: "https://movierevue-77901.firebaseio.com",
  projectId: "movierevue-77901",
  storageBucket: "movierevue-77901.appspot.com",
  messagingSenderId: "400683084959",
  appId: "1:400683084959:web:60ba703937917ffe5b46aa",
  measurementId: "G-W4HG0MR2SZ"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
  // timestampsInSnapshots: true
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection("newUsers");
const reviewCollection = db.collection("reviewCollection");
// const allUsers = auth.
// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  reviewCollection,
  // allUsers
  // postsCollection,
  // commentsCollection,
  // likesCollection
};
