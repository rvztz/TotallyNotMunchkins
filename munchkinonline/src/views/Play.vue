<template>
    <div id="play">
        <Card v-bind:cardData="cardData" v-on:create-game="createGame" v-on:join-game="joinGame"/>
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
                        placeholder: "Room Name"
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
        createGame(data) {
            // Game creation here
            console.log("CREATE GAME");
            console.log(data);
        },
        joinGame(data) {
            // Join game here
            console.log("JOIN GAME");
            console.log(data);
        }
    }
}
</script>

<style scoped>
#play {
    display: flex;
    justify-content: center;
}

.elem {
    padding-top: 10px;
}

</style>