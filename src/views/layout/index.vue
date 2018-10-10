<template>
  <div class="layout">
    <v-header></v-header>
    <v-main></v-main>
    <v-footer></v-footer>
  </div>
</template>

<script>
import header from '@/components/common/header.vue'
import footer from '@/components/common/footer.vue'
import main from '@/components/common/main.vue'
export default {
  name: 'layout',
  components: {
    'v-header': header,
    'v-footer': footer,
    'v-main': main
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
