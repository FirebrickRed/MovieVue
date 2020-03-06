<template>
  <div>
    <h1>Search!</h1>
    <h2>{{ $route.params.title }}</h2>
    <div id="movieholder">
      <div v-for="movie in movieList" :key="movie.id">
        <Movie v-bind:movie="movie" />
      </div>
    </div>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
    <h1>Actors</h1>
    <b-pagination
      v-model="currentPage2"
      :total-rows="rows2"
      :per-page="perPage2"
      aria-controls="my-table"
    ></b-pagination>
    <div id="movieholder">
      <div v-for="actor in actorList" :key="actor.id">
        <Actor v-bind:actor="actor" />
      </div>
    </div>
  </div>
</template>

<script>
import movieApi from "../services/api/movie.js";
import actorApi from "../services/api/actor.js";
import Movie from "../components/Movie";
import Actor from "../components/Actor";
export default {
  components: {
    Movie,
    Actor
  },
  data() {
    return {
      movies: [],
      actors: [],
      perPage: 8,
      currentPage: 1,
      id: "my-table",
      currentPage2: 1,
      perPage2: 4
    };
  },
  computed: {
    rows() {
      return this.movies.length;
    },
    rows2() {
      return this.actors.length;
    },
    movieList() {
      // Return just page of items needed
      return this.movies.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    actorList() {
      return this.actors.slice(
        (this.currentPage2 - 1) * this.perPage2,
        this.currentPage2 * this.perPage2
      );
    }
  },
  props: ["title"],
  created() {
    this.movies = [];
    movieApi
      .getMoviesBySearch(this.$route.params.title)
      .then(movies => {
        // console.log(movies);
        this.movies = movies.results;
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loading = false;
      });
    actorApi
      .getActorsBySearch(this.$route.params.title)
      .then(actors => {
        console.log("actors");
        console.log(actors);
        this.actors = actors.results;
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>

<style lang="scss" scoped>
#movieholder {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
