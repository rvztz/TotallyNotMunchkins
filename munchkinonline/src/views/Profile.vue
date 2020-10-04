<template>
  <div class = 'container'>
    <div>
      <b-card class="profileCard" id="profile" title="Profile">
        <b-card-text>Your Username</b-card-text>
        <b-card-text>Your Email</b-card-text>
        <b-card-text>Date Joined:</b-card-text>
      </b-card>
    </div>

    <b-card bg-variant = 'dark' text-variant = 'white' title = 'Historial de Juego'>
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
import {BCard} from 'bootstrap-vue';
import firebase from 'firebase'; 

export default {
  name: "Profile",
  components: {
    BCard
  },
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

<style scoped>

.container {
  text-align: left;
}

.card {
  width: 70%;
  margin: 0 auto;
}

#profile {
  width: 50%;
  margin: 20px auto 50px auto;
}

</style>