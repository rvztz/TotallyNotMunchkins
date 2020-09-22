<template>
    <b-card title="Sign In" style="width: 25%">
        <div class="container">
            <TextField />
            <TextField />
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
    }
}
</script>