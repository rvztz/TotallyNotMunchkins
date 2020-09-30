<template>
  <div class = 'container'>
  <b-card bg-variant = 'dark' text-variant = 'white' title = 'Información de usuario'>
    <b-card-text>
      <p> {{user.displayName}}</p>
      <p>{{user.email}}</p>
    </b-card-text>
    <b-button href="#" variant="primary" @click = 'logOut()'>Cerrar sesión</b-button>
  </b-card>

  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase'; 

export default {
  data() {
    return {
      user: null
    }; 
  }, 
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user; 
      } else {
        this.user = null;
      }
    });
  }, 
  methods: {
    logOut() {
      firebase.auth().signOut().then(() => {
        firebase.auth().onAuthStateChanged(() => {
          this.$router.push('/')
        })
      })
    }
  }
};
</script>
