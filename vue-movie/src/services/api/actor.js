import axios from "axios";

export default {
  getActorById(id) {
    return axios
      .get(
        `/person/${id}?api_key=da5ed9adab24bc28615308d12323e418&language=en-US`
      )
      .then(res => {
        return res.data;
      });
  },
  getActorsMovies(personId) {
    return axios
      .get(
        `/person/${personId}/movie_credits?api_key=da5ed9adab24bc28615308d12323e418&language=en-US`
      )
      .then(res => {
        return res.data;
      });
  },
  getActorsBySearch(name) {
    return axios
      .get(
        `https://api.themoviedb.org/3/search/person?api_key=da5ed9adab24bc28615308d12323e418&query=${name}`
      )
      .then(res => {
        return res.data;
      });
  }
};
