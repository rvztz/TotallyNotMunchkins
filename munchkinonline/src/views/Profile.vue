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
          <div v-bind:key="entry.id" v-for="entry in gameHistory">
            <AccordionElement v-bind:entryData="entry" />
          </div>
        </div>
      </b-card>
    </div>

    <div>
      <SiteButton v-bind:buttonData="buttonData" v-on:btn-click="logOut()"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {BCard} from 'bootstrap-vue';
import firebase from 'firebase';
import SiteButton from '../components/site-interface/SiteButton'
import AccordionElement from '../components/site-interface/AccordionElement'
import { userCollection, gameCollection } from '../main.js';

export default {
  name: "profile",
  components: {
    BCard,
    AccordionElement,
    SiteButton
  },
  data() {
    return {
      userData: {
        name: "",
        email: "",
        joined: ""
      },
      gameHistory: [],
      buttonData: {
        id: 101,
        buttonText: "Log Out",
        eventName: "logout"
      }
    }; 
  }, 
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.getUserData(user)
      } else {
        this.userData = {
          name: "",
          email: "",
          joined: ""}
      }
    })
  }, 
  methods: {
    logOut() {
      if(this.userData.email != "") {
        firebase.auth().signOut().then(() => {
          firebase.auth().onAuthStateChanged(() => {
            this.$router.push('/')
          })
        })
      } else {
        alert("You have not signed in")
      }
    },
    getUserData(user) {
      userCollection.where("email", "==", user.email)
        .limit(1)
        .get()
        .then(q => {
          this.userData = q.docs[0].data()
          this.getGameHistory()
        })
        .catch(e => {
            console.log("Error loading user data: ", e)
        })
    },
    getGameHistory() {
      gameCollection.where("emails", "array-contains", this.userData.email)
      .limit(10)
      .get()
      .then(q => {
        this.gameHistory = q.docs.map(doc => {return {data: doc.data(), id: doc.id}})
      })
      .catch(e => {
        console.log("Error getting game data: ", e)
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


