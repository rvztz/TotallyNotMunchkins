<template>
    <div id="play">
        <div id="nav">
            <div id="title">
                Munchkin Online 
            </div>
            <div id="navBar">
                <span> <router-link to="/about">About</router-link> | </span>
                <span> <router-link to="/profile">Profile</router-link> | </span>
                <span> <router-link to="/play">Play</router-link> | </span>
                <a v-on:click="logOut()"> Sign Out </a>
            </div>
        </div>
        <div id="line" />
        <Card id="card" v-bind:cardData="cardData" v-on:create-game="createGame" v-on:join-game="joinGame"/>
        <div id="rest">
        </div>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'
import firebase from 'firebase';
import { userCollection } from '../main.js';
import swal from 'sweetalert'

export default {
    name: 'play',
    components: {
        Card
    },
    data () {
        return {
            cardData: {
                title: "Create or Join Game",
                textFields: [
                    {
                        id: 100,
                        placeholder: "Room Name",
                        type: "text"
                    }
                ],
                buttons: [
                    {
                        id: 201,
                        buttonText: "Create Game",
                        eventName: "create-game"
                    },
                    {
                        id: 202,
                        buttonText: "Join Game",
                        eventName: "join-game"
                    },
                ],
                footerLink : {
                    display: false,
                    route: "",
                    text: ""
                }
            },
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
        //data = ["roomName"]
        async createGame(data) {
            // Game creation here
            if(data[0].length > 0) {
                let response = await this.roomExists(data[0])
                if (response.ans) {
                    // Room exists, so tell the user they can't create it
                    swal("Oops!", "Room already exists.", "error")
                }
                else {
                    // Room doesn't exist, so create it and make this user the host
                    localStorage.setItem('roomEvent', 'createRoom')
                    localStorage.setItem('roomName', data[0])
                    this.$router.push('/game')
                }
            } else {
                swal("Oops!", "Please enter a room name", "error")
            }
        },
        async joinGame(data) {
            if(data[0].length > 0) {
                let response = await this.roomIsJoinable(data[0])
                if (response.ans) {
                    // Room exists, so join the room
                    localStorage.setItem('roomEvent', 'joinRoom')
                    localStorage.setItem('roomName', data[0])
                    this.$router.push('/game')
                } else {
                    swal("Oops!", response.message, "error")
                }
            } else {
                swal("Oops!", "Please enter a room name", "error")
            }
        },
        async roomExists(roomName) {
            const url = `http://localhost:3000/api/roomExists?name=${roomName}`

            try {
                let response = await fetch(url)
                return await response.json()
            } catch (error) {
                console.log("Error: " + error)
            }
        },
        async roomIsJoinable(roomName) {
            const url = `http://localhost:3000/api/roomIsJoinable?name=${roomName}&userName=${localStorage.getItem('userName')}`

            try {
                let response = await fetch(url)
                return await response.json()
            } catch (error) {
                console.log("Error: " + error)
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
                swal("Oops!", "You have not signed in", "error")
            }
        }
    }
}

</script>

<style scoped>
#card {
    margin: 20px auto 50px auto;
}

#rest {
    padding-bottom: 332px;
}

</style>