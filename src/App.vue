<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from '@/plugins/vuetify'

import { getComponents } from '@/utils/utils'

Vue.use(Vuetify)

getComponents((componentName, componentConfig) => {
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

export default {
  name: 'App',
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
