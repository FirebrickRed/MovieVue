<template>
  <div class="home">
    <h1>Movie ReVue!</h1>
    <img alt="Vue logo" src="../assets/MovieReVueLogo.png" />
    <div id="movieholder">
      <div v-for="movie in movies" :key="movie.id">
        <Movie v-bind:movie="movie" />
      </div>
    </div>
  </div>
</template>

<script>
import movieApi from "../services/api/movie";
import Movie from "../components/Movie";
// import {mapState} from 'vuex';
// const fb = require('../router/firebaseConfig.js');
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// console.log(state);
export default {
  components: {
    Movie
  },
  data() {
    return {
      movies: []
    };
  },
  created() {
    movieApi
      .getNowPlayingMovie()
      .then(movies => {
        this.movies = movies.results;
        console.log(this.movies);
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loading = false;
      });
  }
  // computed: {
  //   ...mapState(['userProfile'])
  // },
};
</script>

<style>
#movieholder {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
