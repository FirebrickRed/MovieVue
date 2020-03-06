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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
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
