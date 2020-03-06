<template>
  <div>
    <div @mouseover="hover = true" @mouseleave="hover = false" id="img">
      <router-link :to="{ name: 'Single Movie', params: { id: movie.id } }">
        <h1 v-if="hover">{{ movie.title }}</h1>
        <img v-if="movie.poster_path" :src="path + movie.poster_path" />
        <img v-if="!movie.poster_path" src="https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png" />
        <p v-if="hover">{{ movie.overview }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
let path;
// let path = `https://image.tmdb.org/t/p/w500/`;
console.log(path);
export default {
  name: "movie",
  props: {
    movie: Object
    // posterLink: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
  },
  data() {
    return {
      path: "https://image.tmdb.org/t/p/w500/",
      hover: false
    };
  }
};
</script>

<style lang="scss" scoped>
#img {
  width: fit-content;
  overflow: hidden;
  position: relative;
  margin: 25px;
  border: 10px #41b883 ridge;
  color: #35495e;
}
img {
  width: 300px;
  height: 450px;
}
#img:hover {
  img {
    object-fit: cover;
    opacity: 0.1;
  }
}
h1 {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -5%);
  font-size: 25px;
  color: #35495e;
}
p {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -100%);
  color: #35495e;
}
</style>
