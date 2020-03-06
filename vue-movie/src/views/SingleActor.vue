<template>
  <div>
    <h1>{{ actor.name }}</h1>
    <img :src="path + actor.profile_path" />
    <h3>Born: {{ actor.birthday }}</h3>
    <h3>Died: {{ actor.deathday }}</h3>
    <p>{{ actor.biography }}</p>
    <h3>Acted in (movies):</h3>
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
  </div>
</template>

<script>
import actorApi from "../services/api/actor";
import Movie from "../components/Movie";
export default {
  components: {
    Movie
  },
  data() {
    return {
      actor: Object,
      movies: [],
      perPage: 4,
      currentPage: 1,
      id: "my-table",
      path: "https://image.tmdb.org/t/p/w500/"
    };
  },
  computed: {
    rows() {
      return this.movies.length;
    },
    movieList() {
      return this.movies.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    }
  },
  created() {
    actorApi.getActorById(this.$route.params.id).then(actor => {
      this.actor = actor;
      console.log(actor);
    });
    actorApi.getActorsMovies(this.$route.params.id).then(actorsMovies => {
      this.movies = actorsMovies.cast;
      console.log(this.movies);
    });
  }
};
</script>
