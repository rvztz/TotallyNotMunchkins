<template>
  <div id="app">
    <div id="nav" v-if="['Game'].indexOf($route.name) == -1">
      <div id="title">
        Munchkin Online 
      </div>
      <router-link to="/">Sign In</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/signup">Sign Up</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/play">Play</router-link>
    </div>
    <div id="line">
  </div>
    <router-view/>
  </div>
</template>

<style>
#title {
  display: inline-block;
  font-size: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-weight: bold;
  margin-right: 268px;
  }

#line{
  display : block;
  height : 10px;
  border : 0;
  border-top : 3px solid black;
}

#app {
  background-image: url("~@/BG.png");
  background-size: cover;
  background-attachment: fixed;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(0, 0, 0);
}

#nav {
  padding: 25px 40px;
  background-color : #00000086;
  text-align: right;  
}

#nav a {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

#nav a:hover {
  opacity: 30%;
}

#nav a.router-link-exact-active {
  color: #42b983;
  opacity: 100%;
}
</style>
