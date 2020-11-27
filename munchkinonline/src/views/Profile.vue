<template>
  <div>
    <div id="nav">
        <div id="title">
          Munchkin Online 
        </div>
        <div id="navBar">
          <span> <router-link to="/about">About</router-link> | </span>
          <span> <router-link to="/profile">Profile</router-link> | </span>
          <span> <router-link to="/play">Play</router-link> </span>
        </div>
      </div>
      <div id="line" />


  <div class='container'>
      <div>
      <b-card id="userProfile" title="Your Profile">
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

        <div id="logOutDiv">
          <SiteButton v-bind:buttonData="buttonData" v-on:btn-click="logOut()"/>
        </div>
      </b-card>
    </div>

    <div id="rest">
    </div>
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
            localStorage.removeItem("userName")
            localStorage.removeItem("userEmail")
            window.location.href = '/'
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
          localStorage.setItem("userName", this.userData.name)
          localStorage.setItem("userEmail", this.userData.email)
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

#rest {
  padding-bottom: 318px;
}

.container {
  text-align: left;
}

#history {
  width: 75%;
  margin: 0 auto;
}

#userProfile {
  width: 60%;
  margin: 20px auto 50px auto;
}

#logOutDiv {
  margin-top: 40px;
}
</style>


