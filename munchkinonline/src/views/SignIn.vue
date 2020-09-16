<template>
    <div id="signin">
        <b-card title="Sign In">
            <div class="container">
                <div class="elem">
                    <label for="uname"><b>Username</b></label>
                    <input type="text" placeholder="Enter Username" name="uname" required>
                </div>

                <div class="elem">
                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" required>
                </div>

                <div class="elem">
                    <button type="submit">Login</button>
                    <label>
                    <input type="checkbox" checked="checked" name="remember"> Remember me
                    </label>
                </div>
                <div>
                    <router-link to="/signup">No tienes cuenta?</router-link>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>
import {BCard} from 'bootstrap-vue'

export default {
    name: 'signin',
    components: {
        BCard
    }
}
</script>

<style scoped>
#signin {
    display: flex;
    justify-content: center;
}

.b-card {
    
}

.elem {
    padding-top: 10px;
}

</style>