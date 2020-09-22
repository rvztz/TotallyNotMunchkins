<template>
    <div id="signin">
        <Card />
    </div>
</template>

Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})

<blog-post title="My journey with Vue"></blog-post>

<script>
import Card from '../components/site-interface/Card'

export default {
    name: 'signin',
    components: {
        Card
    }
}
</script>

<style scoped>
#signin {
    display: flex;
    justify-content: center;
}

.elem {
    padding-top: 10px;
}

</style>