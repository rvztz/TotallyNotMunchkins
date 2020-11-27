<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#title {
  font-size: 25px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-weight: bold;
}

#line{
  display : block;
  height : 10px;
  border : 0;
  border-top : 3px solid black;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(0, 0, 0);
}

#nav {
  padding: 25px 0;
  background-color : #17a2b8;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

#navBar {
  padding: 0 40px;
  position: absolute;
  right: 0;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

#nav a:hover {
  opacity: 70%;
}

#nav a.router-link-exact-active {
  text-decoration: underline;
  opacity: 100%;
}
</style>
