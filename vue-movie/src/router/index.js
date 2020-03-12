import Vue from "vue";
import VueRouter from "vue-router";
// import firebase from 'firebase';
import { FormPlugin } from "bootstrap-vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
Vue.use(FormPlugin);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue")
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/Login/SignUp.vue")
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: () => import("../views/Login/ForgotPassword.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue")
  },
  {
    path: "/single-movie/:id",
    name: "Single Movie",
    props: true,
    component: () => import("../views/SingleMovie.vue")
  },
  {
    path: "/search/:title",
    name: "Search",
    props: true,
    component: () => import("../views/Search.vue")
  },
  {
    path: "/single-actor/:id",
    name: "Single Actor",
    props: true,
    component: () => import("../views/SingleActor.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
