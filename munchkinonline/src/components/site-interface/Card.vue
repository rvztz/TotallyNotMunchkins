<template>
    <b-card v-bind:title="cardData.title" style="width: 25%">
        <div class="container">
            <div v-bind:key="textField.id" v-for="textField in cardData.textFields">
                <TextField v-bind:fieldData="textField" ref="textfields"/>
            </div>

            <div v-bind:key="button.id" v-for="button in cardData.buttons">
                <SiteButton v-bind:buttonData="button" v-on:btn-click="getTextFieldValues"/>
            </div>

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
    methods: {
        getTextFieldValues() {
            this.$emit('btn-click', this.$refs.textfields.map(tf => tf.getValue()))
        }
    },
    props: ["cardData"]    
}
</script>