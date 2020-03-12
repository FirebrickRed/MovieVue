<template>
  <div>
    Admin!
    <div>
      <input v-bind:value="search" v-on:input="search = $event.target.value" />
      <button @click="userSearch"><b-icon-search></b-icon-search></button>
    </div>
    <div v-if="user.email != null">
      {{ user }}
      <button @click="deleteUser()">Delete</button>
    </div>
  </div>
</template>

<script>
import { usersCollection, reviewCollection } from "../router/firebaseConfig";
export default {
  data() {
    return { search: "", user: Object, userId: "" };
  },
  methods: {
    userSearch() {
      usersCollection.where("email", "==", this.search).onSnapshot(query => {
        query.forEach(doc => {
          this.user = doc.data();
          this.userId = doc.id;
        });
        console.log(this.user);
      });
    },
    deleteUser() {
      console.log(this.userId);
      usersCollection.doc(this.userId).delete().then(() => {
        console.log(":shrug:");
      }).catch(error => {
        console.log(error);
      });
      reviewCollection.where("userId", "==", this.userId).delete().then(() => {
        console.log("deleted");
      }).catch(error => {
        console.log(error);
      })
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  border: 1px black solid;
}
button{
  padding: 5px;
}
</style>
