<template>
    <b-card v-bind:title="cardData.title" style="width: 25%">
        <div class="container">
            <div v-bind:key="textField.id" v-for="textField in cardData.textFields">
                <TextField v-bind:fieldData="textField"/>
            </div>
            <SiteButton />
            <div class="elem">
                <router-link to="/signup">Don't have an account?</router-link>
            </div>
        </div>
    </b-card>
</template>

<script>
import {BCard} from 'bootstrap-vue'
import TextField from './TextField'
import SiteButton from './SiteButton'

export default {
    name: 'Card',
    components: {
        BCard,
        TextField,
        SiteButton
    },
    props: ["cardData"]
}
</script>