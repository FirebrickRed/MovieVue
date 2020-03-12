<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <input
        v-bind:value="something"
        v-on:input="something = $event.target.value"
      />
      <button @click="search"><b-icon-search></b-icon-search></button>
      <div class="noUser" v-if="!currentUser">
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">SignUp</router-link>
      </div>
      <div class="user" v-if="currentUser">
        <router-link to="/profile">{{ currentUser.email }}</router-link>
        <a @click="logout">logout</a>
        <div v-if="userProfile.isAdmin">
          <router-link to="/admin">admin</router-link>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import { firestorePlugin } from "vuefire";
import { mapState } from "vuex";
const fb = require("./router/firebaseConfig.js");
import "./assets/boot.scss";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(firestorePlugin);

export default {
  data() {
    return {
      something: ""
    };
  },
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.$router.push(`/search/${this.something}`);
      this.something = "";
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Quicksand", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background: #a4dfc4;
  width: fit-content;
  margin: auto;
  border: 5px ridge darken(#a4dfc4, 15%);
  border-top: none;
  display: flex;

  input {
    border-radius: 15px 0px 0px 15px;
    border: 3px ridge #35495e;
    background: lighten(#35495e, 35%);
    padding: 5px;
    border-right: none;
  }

  button {
    border-radius: 0px 15px 15px 0px;
    border: 3px ridge #35495e;
    background: lighten(#35495e, 35%);
    padding: 5px;
    border-left: none;
  }

  button:hover {
    background: lighten(#35495e, 20%);
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    padding: 5px;
    font-size: 20px;

    &.router-link-exact-active {
      color: darken(#42b983, 10%);
    }
  }
}
</style>
