<template>
  <div>
    <div @mouseover="hover = true" @mouseleave="hover = false" id="img">
      <router-link :to="{ name: 'Single Actor', params: { id: actor.id } }">
        <h1 v-if="hover">{{ actor.name }}</h1>
        <img v-if="actor.profile_path" :src="path + actor.profile_path" />
        <img
          v-if="!actor.profile_path && actor.gender == 2"
          src="https://vignette.wikia.nocookie.net/ttgot-s2-au/images/2/26/Placeholder_male.png/revision/latest?cb=20150622232836"
        />
        <img
          v-if="!actor.profile_path && actor.gender == 1"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQFNXhNymXq57qyyWbRRVaQWy5VjiiKqgo9sL72eZBU9Kae-nsq"
        />
        <img
          v-if="!actor.profile_path && actor.gender == 0"
          src="https://kidscasa.org/wp-content/uploads/2018/09/HEADSHOT-PLACEHOLDER.jpg"
        />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "actor",
  props: {
    actor: Object
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
