<template>
  <div class="error-data">
    <div class="title">未同步数据</div>
    <el-tabs v-model="activeRouter" type="card" @tab-click="handleClick">
      <el-tab-pane label="未同步工单" name="unsynchronizedList">
      </el-tab-pane>
      <el-tab-pane label="未同步库存状态" name="unsynchronizedStock">
      </el-tab-pane>
      <el-tab-pane label="未同步交易数据" name="unsynchronizedTransaction">
      </el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'errorData',
  components: {
  },
  data () {
    return {
      activeRouter: 'unsynchronizedList'
    }
  },
  mounted () {
    this.activeRouter = this.$route.path.split('/')[this.$route.path.split('/').length - 1]
  },
  methods: {
    handleClick (tab) {
      this.$router.push(tab.name)
    }
  }
}
</script>

<style lang="sass">
  @import "error-data"
</style>
