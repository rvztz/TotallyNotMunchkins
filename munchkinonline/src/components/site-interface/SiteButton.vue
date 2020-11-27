<template>
    <div>
        <b-button style="width: 100%" variant="outline-info" v-on:click="$emit('btn-click')">{{buttonData.buttonText}}</b-button>
    </div>
</template>

<script>
import {BButton} from 'bootstrap-vue'

export default {
    name: 'SiteButton',
    components: {
        BButton
    },
    props: ["buttonData"]
}
</script>

<style scoped>
    div {
        margin: 0 auto;
        margin-top: 40px;
        width: 70%;
        background-color: #fff;
    }
</style>