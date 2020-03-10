import Vue from "vue";
import Vuex from "vuex";
const fb = require("./firebaseConfig.js");

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");
  }
  fb.reviewCollection.orderBy("createdOn", "desc").onSnapshot(querySnapshot => {
    let reviewArray = [];
    querySnapshot.forEach(doc => {
      let review = doc.data();
      review.id = doc.id;
      reviewArray.push(review);
    });
    store.commit("setReview", reviewArray);
  });
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    reviews: []
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setReview", null);
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setReview(state, val) {
      state.reviews = val;
    }
  }
});
