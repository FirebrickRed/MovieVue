<template>
  <div>
    <img :src="path + movie.backdrop_path" />
    <h1>{{ movie.title }}</h1>
    <div v-for="review in reviews" :key="review.id">
      <div v-if="review.movieId == $route.params.id">
        <Review v-bind:review="review" />
        <div v-if="review.userId == currentUser.uid">
          <button @click="edit(review.id)">Edit</button>
        </div>
      </div>
    </div>
    <div v-if="currentUser">
      <h1>form</h1>
      <form id="reviewForm" v-on:submit.prevent="addReview">
        <input type="text" v-model="review.review" placeholder="review" />
        <!-- <v-rating v-model="iRating"></v-rating> -->
        <v-rating
          v-model="iRating"
          color="#42b983"
          half-increments
          hover
          x-large
        ></v-rating>
        <button type="submit">Add Review</button>
      </form>
    </div>
    <div id="movieholder">
      <div v-for="actor in actorList" :key="actor.id">
        <Actor v-bind:actor="actor" />
      </div>
    </div>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
  </div>
</template>

<script>
import movieApi from "../services/api/movie";
import Review from "../components/Review";
import Actor from "../components/Actor";
import { mapState } from "vuex";

const fb = require("../router/firebaseConfig.js");

export default {
  components: {
    Review,
    Actor
  },
  data() {
    return {
      path: "https://image.tmdb.org/t/p/w500/",
      review: {
        review: "",
        rating: ""
      },
      movie: Object,
      actors: [],
      perPage: 4,
      currentPage: 1,
      id: "my-table",
      iRating: 2.5
    };
  },
  created() {
    movieApi.getMovieById(this.$route.params.id).then(movie => {
      this.movie = movie;
      console.log(this.movie);
    });
    movieApi.getCastByMovieId(this.$route.params.id).then(cast => {
      console.log(cast);
      this.actors = cast.cast;
    });
  },
  computed: {
    ...mapState(["currentUser", "reviews", "userProfile"]),
    rows() {
      return this.actors.length;
    },
    actorList() {
      return this.actors.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    }
  },
  methods: {
    addReview() {
      console.log(this.userProfile);
      fb.reviewCollection
        .add({
          createdOn: new Date(),
          userId: this.currentUser.uid,
          review: this.review.review,
          rating: this.iRating,
          movieId: this.$route.params.id,
          userName: this.userProfile.username
        })
        .then(ref => {
          console.log(ref);
          this.review.review = "";
          this.review.rating = 0;
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit(id){
      console.log(id);
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 75%;
}
input {
  border: 1px solid black;
  padding: 3px;
}
button{
  border: 1px black solid;
  background: #42b983;
  color: white;
  padding: 3px;
}
button:hover{
  background: darken(#42b983, 10%);
}
</style>
