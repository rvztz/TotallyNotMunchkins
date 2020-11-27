<template>
  <div class="about">
    <div id="nav">
      <div id="title">
        Munchkin Online 
      </div>
      <div id="navBar">
        <span> <router-link to="/about">About</router-link> | </span>
        <span v-if="userData.name == ''"> <router-link to="/">Sign In</router-link> | </span>
        <span v-if="userData.name == ''"> <router-link to="/signup">Sign Up</router-link> </span>
        <span v-if="userData.name != ''"> <router-link to="/profile">Profile</router-link> | </span>
        <span v-if="userData.name != ''"> <router-link to="/play">Play</router-link> | </span>
        <a v-if="userData.name != ''" v-on:click="logOut()"> Sign Out </a>
      </div>
    </div>
    <div id="line" />
    <div class="contain">
      <div>
      <img src="https://www.bestchoicereviews.org/wp-content/uploads/2014/12/munchkin-card-and-board-games.png" alt="Test image" class="gif"/>
      </div>
      <div class="aboutText">
        <h1 id="titleAbout">What is Munchkin?</h1>
        <p>
          Go down in the dungeon. Kill everything you meet. Backstab your friends and steal their stuff. Grab the treasure and run.
        </p>
        <p>
          Admit it. You love it.
        </p> 
        <p>
          Munchkin is the mega-hit card game about dungeon adventure . . . with none of that stupid roleplaying stuff. You and your friends compete to kill monsters and grab magic items. 
          And what magic items! Don the Horny Helmet and the Boots of Butt-Kicking. Wield the Staff of Napalm . . . or maybe the Chainsaw of Bloody Dismemberment. 
          Start by slaughtering the Potted Plant and the Drooling Slime, and work your way up to the Plutonium Dragon . . .
        </p> 
        <p>
          And it's illustrated by John Kovalic!
        </p>
        <p>
          Fast-playing and silly, Munchkin can reduce any roleplaying group to hysteria. And while they're laughing, you can steal their stuff.
        </p>
        <p>
          Ages 10 and up. Plays in one to two hours. Three to six players.
        </p>
        <p>
          Designed by Steve Jackson
        </p>
      </div>
    </div>
    <div id="rest">
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { userCollection } from '../main.js';

export default {
    name: 'About',
    data () {
        return {
            userData: {
                name: "",
                email: "",
                joined: ""
            }
        }
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
      getUserData(user) {
        userCollection.where("email", "==", user.email)
          .limit(1)
          .get()
          .then(q => {
          this.userData = q.docs[0].data()
          localStorage.setItem("userName", this.userData.name)
          localStorage.setItem("userEmail", this.userData.email)
          })
          .catch(e => {
              console.log("Error loading user data: ", e)
          })
      },
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
      }
    }
}
</script>

<style scoped>

#titleAbout {
  color: black;
  margin: 20px auto 20px auto;
}

.contain{
  width : 1300px;
  background-color : white;
  margin: 20px auto;
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
  width: 50%;
}

.aboutText {
  width: 60%;
  margin: 40px auto;
  text-align: left;
}

#rest {
  padding-bottom: 37px;
}

</style>