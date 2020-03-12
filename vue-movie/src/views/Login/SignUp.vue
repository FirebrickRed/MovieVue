<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent="onSubmit">
      <input
        v-model="form.fName"
        type="text"
        required
        placeholder="Enter First Name"
      />
      <input
        v-model="form.lName"
        type="text"
        required
        placeholder="Enter Last Name"
      />
      <input v-model="form.street" type="text" placeholder="Enter Street" />
      <input v-model="form.city" type="text" placeholder="Enter City" />
      <input v-model="form.state" type="text" placeholder="Enter State" />
      <input v-model="form.zip_code" type="text" placeholder="Enter Zip Code" />
      <input
        v-model="form.email"
        type="text"
        required
        placeholder="Enter Email"
      />
      <input
        v-model="form.password"
        type="text"
        required
        placeholder="Enter Password"
      />
      <input v-model="form.phone" type="text" placeholder="Enter Phone" />
      <input v-model="form.username" type="text" placeholder="Enter Username" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
const fb = require("../../router/firebaseConfig.js");
export default {
  data() {
    return {
      form: {
        fName: "",
        lName: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        email: "",
        password: "",
        phone: "",
        username: ""
      }
    };
  },
  methods: {
    onSubmit() {
      fb.auth
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(user => {
          this.$store.commit("setCurrentUser", user);
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              firstName: this.form.fName,
              lastName: this.form.lName,
              street: this.form.street,
              city: this.form.city,
              state: this.form.state,
              zip_code: this.form.zip_code,
              phone: this.form.phone,
              username: this.form.username,
              email: this.form.email
            })
            .then(() => {
              this.$store.dispatch("fetchUserProfile");
              this.$router.push("/");
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: auto;
}
input {
  border: 1px black solid;
  padding: 3px;
}
button{
  border: 1px black solid;
  background: #42b983;
  color: white;
}
button:hover{
  background: darken(#42b983, 10%);
}
</style>
