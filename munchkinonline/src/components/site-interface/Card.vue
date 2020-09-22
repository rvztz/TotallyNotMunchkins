<template>
    <b-card title="Sign In" style="width: 25%">
        <div class="container">
            <TextField />
            <TextField />

            <div class="elem">
                <button type="submit">Login</button>
                <label>
                <input type="checkbox" checked="checked" name="remember"> Remember me
                </label>
            </div>
            <div class="elem">
                <router-link to="/signup">No tienes cuenta?</router-link>
            </div>
        </div>
    </b-card>
</template>

<script>
import {BCard} from 'bootstrap-vue'
import TextField from './TextField'

export default {
    name: 'Card',
    components: {
        BCard,
        TextField
    }
}
</script>