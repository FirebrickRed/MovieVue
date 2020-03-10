import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./router/store.js"; //'./store.js'
const fb = require("./router/firebaseConfig.js"); //'./firebaseConfig.js')
import axios from "axios";
import vuetify from "./plugins/vuetify";

axios.defaults.baseURL = "https://api.themoviedb.org/3";

Vue.config.productionTip = false;

let app;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
