<template>
  <div class="instrument">
    <div class="title">首页仪表盘
    </div>
      <!-- <div class="router-box">
        <router-link :to="{path: '/front/instrument'}" :class="{'routerCheck': true}">订单式生产</router-link>
        <router-link :to="{path: '/front/instrument/available'}">可得式生产</router-link>
      </div> -->
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'instrument',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="sass">
  @import 'index'
</style>
