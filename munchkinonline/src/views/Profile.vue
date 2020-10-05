<template>
  <div class = 'container'>
    <div>
      <b-card id="profile" title="Your Profile">
        <b-card-text>Username: {{userData.name}}</b-card-text>
        <b-card-text>Email: {{userData.email}}</b-card-text>
        <b-card-text>Date Joined: {{userData.joined}}</b-card-text>
      </b-card>
    </div>

    <div>
      <b-card id="history" title='Game History'>
        <div class="accordion" role="tablist">
          <AccordionElement />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {BCard} from 'bootstrap-vue';
import firebase from 'firebase';
import AccordionElement from '../components/site-interface/AccordionElement.vue'
import { userCollection } from '../main.js';

export default {
  name: "profile",
  components: {
    BCard,
    AccordionElement
  },
  data() {
    return {
      userData: {
        name: "",
        email: "",
        joined: ""
      }
    }; 
  }, 
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userCollection.where("email", "==", user.email)
        .limit(1)
        .get()
        .then(querySnapshot => {
          this.userData = querySnapshot.docs[0].data()
        })
        .catch(function(error) {
            console.log("Error loading user data: ", error)
          }
        )
      } else {
        this.userData = null
      }
    })
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

#history {
  width: 70%;
  margin: 0 auto;
}

#profile {
  width: 60%;
  margin: 20px auto 50px auto;
}

</style>


