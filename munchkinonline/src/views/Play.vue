<template>
    <div id="play">
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
        <Card id="card" v-bind:cardData="cardData" v-on:create-game="createGame" v-on:join-game="joinGame"/>
        <div id="rest">
        </div>
    </div>
</template>

<script>
import Card from '../components/site-interface/Card'

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
            }
        }
    },
    methods: {
        //data = ["roomName"]
        async createGame(data) {
            // Game creation here
            let response = await this.roomExists(data[0])
            if (response.ans) {
                // Room exists, so tell the user they can't create it
                alert("Room already exists.")
            }
            else {
                // Room doesn't exist, so create it and make this user the host
                localStorage.setItem('roomEvent', 'createRoom')
                localStorage.setItem('roomName', data[0])
                this.$router.push('/game')
            }
        },
        async joinGame(data) {
            let response = await this.roomIsJoinable(data[0])
            if (response.ans) {
                // Room exists, so join the room
                localStorage.setItem('roomEvent', 'joinRoom')
                localStorage.setItem('roomName', data[0])
                this.$router.push('/game')
            } else {
                alert(response.message)
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