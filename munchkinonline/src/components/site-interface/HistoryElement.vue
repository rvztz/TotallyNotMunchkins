<template>
    <b-card
        border-variant="info"
        v-bind:header="entryData.data.roomName + ' - ' + entryData.data.date"
        header-bg-variant="info"
        header-text-variant="white"
        align="center"
    >
        <b-card-text>
            <p v-bind:key="index" v-for="(element, index) in elements">
                <span v-bind:class="element.pos">{{element.pos}}.  {{element.value}}</span>
            </p>
        </b-card-text>
    </b-card>
</template>

<script>
import {BCard} from 'bootstrap-vue'

export default {
    name: 'HistoryElement',
    components: {
        BCard
    },
    data() {
        return {
            elements: []
        }
    },
    created() {
        this.generatePositions()
    },
    props: ["entryData"],
    methods: {
        generatePositions() {
            var usernames = this.entryData.data.usernames
            var winner = this.entryData.data.winner

            usernames.forEach((username, index) => {
                if (winner == username)
                    this.elements.push({value: username, pos: "1"})
                else
                    this.elements.push({value: username, pos:`${index+1}`})
            })
        }
    }
}
</script>

<style scoped>

.button {
    width: 100%;
    display: inline-block;
}

</style>