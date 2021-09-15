<template>
  <div id="app">
    <router-view/>
    <div id="menu">
      <circle-menu type="middle-around" :number="4" animate="animated jello" mask='white' circle>
        <i class="fa fa-bars" slot="item_btn"></i>
        <a slot="item_1" class="fa fa-twitter fa-lg"></a>
        <a slot="item_2" class="fa fa-weixin fa-lg"></a>
        <a slot="item_3" class="fa fa-weibo fa-lg"></a>
        <a slot="item_4" class="fa fa-github fa-lg"></a>
      </circle-menu>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import CircleMenu from 'vue-circle-menu'
import { getComponents } from '@/utils/utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.component('CircleMenu', CircleMenu)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

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
