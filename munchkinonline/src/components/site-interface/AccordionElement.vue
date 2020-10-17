<template>
    <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button v-b-toggle="entryData.id" class="button" variant="info">{{entryData.data.room}} - {{entryData.data.date}}</b-button>
        </b-card-header>
        <b-collapse v-bind:id="entryData.id" accordion="game-history" role="tabpanel">
            <b-card-body>
                <p v-bind:key="index" v-for="(element, index) in elements">
                    <span v-bind:class="element.pos">{{element.pos}}.  {{element.value}}</span>
                </p>
            </b-card-body>
        </b-collapse>
    </b-card>
</template>

<script>
import {BCard, BButton, BCollapse} from 'bootstrap-vue'

export default {
    name: 'AccordionElement',
    components: {
        BCard,
        BButton,
        BCollapse
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
            var winners = this.entryData.data.winners
            console.log(usernames, winners)

            usernames.forEach((username, index) => {
                if (winners.includes(username))
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
}

</style>