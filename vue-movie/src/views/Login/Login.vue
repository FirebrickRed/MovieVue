<template>
  <div id="main">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <form id="loginForm" v-on:submit.prevent="login">
      <input type="text" v-model="user.email" placeholder="email" />
      <input type="password" v-model="user.password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
    <transition name="fade">
      <div v-if="errorMsg !== ''" class="error-msg">
        <p>{{ errorMsg }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
const fb = require("../../router/firebaseConfig.js");
// const fb = require('../firebaseConfig.js')
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(user => {
          console.log(user);
          // this.$store.commit('setCurrentUser', user)
          // if above doesn't work use below
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
