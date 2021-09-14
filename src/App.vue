<template>
  <div id="app">
    <router-view/>
    <div id="menu">
      <circle-menu type="middle-around" :number="4" animate="animated jello" mask='white' circle>
        <button type="button" slot="item_btn">+</button>
        <a slot="item_1" class="fa fa-twitter fa-lg">1</a>
        <a slot="item_2" class="fa fa-weixin fa-lg">2</a>
        <a slot="item_3" class="fa fa-weibo fa-lg">3</a>
        <a slot="item_4" class="fa fa-github fa-lg">4</a>
      </circle-menu>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from '@/plugins/vuetify'
import CircleMenu from 'vue-circle-menu'
import { getComponents } from '@/utils/utils'

Vue.use(Vuetify)
Vue.component('CircleMenu', CircleMenu)

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

<style >
.oy-menu-group {
  float: none;
  display: inline-block;
}
</style>
