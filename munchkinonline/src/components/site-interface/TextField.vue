<template>
   <div>
       <b-form-input v-model="textValue" v-bind:placeholder="fieldData.placeholder" ref="input"/>
    </div>
</template>>

<script>
import {BFormInput} from 'bootstrap-vue'

export default {
    name: 'TextField',
    components: {
        BFormInput
    },
    props: ["fieldData"],
    methods: {
        getValue() {
            return this.textValue
        }
    },
    data () {
        return {
            textValue: ''
        }
    }
}
</script>

<style scoped>
    div {
        margin: 25px auto;
        width: 80%;
    }
</style>