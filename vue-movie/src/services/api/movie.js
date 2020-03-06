import axios from "axios";

export default {
  getNowPlayingMovie() {
    return axios
      .get(
        `/movie/now_playing?api_key=da5ed9adab24bc28615308d12323e418&language=en-US&page=1&region=us`
      )
      .then(res => {
        return res.data;
      });
  },
  getMovieById(id) {
    return axios
      .get(`/movie/${id}?api_key=da5ed9adab24bc28615308d12323e418`)
      .then(res => {
        return res.data;
      });
  },
  getMoviesBySearch(name) {
    console.log('in movies by search ', name);
    return axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=da5ed9adab24bc28615308d12323e418&query=${name}`
      )
      .then(res => {
        return res.data;
      });
  },
  getCastByMovieId(id) {
    return axios
      .get(`/movie/${id}/credits?api_key=da5ed9adab24bc28615308d12323e418`)
      .then(res => {
        return res.data;
      });
  }
};

//https://api.themoviedb.org/3/movie/${id}?api_key=${this.api_key}
