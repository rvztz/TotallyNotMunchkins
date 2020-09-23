<template>
   <div>
       <b-form-input v-bind:placeholder="fieldData.placeholder"/>
    </div>
</template>>

<script>
import {BFormInput} from 'bootstrap-vue'

export default {
    name: 'TextField',
    components: {
        BFormInput
    },
    props: ["fieldData"]
}
</script>

<style scoped>
    div {
        margin: 25px auto;
        width: 80%;
    }
</style>