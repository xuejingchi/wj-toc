<template>
  <div class="data-analysis-list">
    <div class="title">数据分析报表</div>
    <el-tabs v-model="activeRouter" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="option in options" :label="option.label" :name="option.route" :key="option.id"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'dataAnalysis',
  components: {
  },
  data () {
    return {
      activeRouter: 'onlineOrder',
      options: [
        {
          id: 1,
          label: '在制品工单',
          route: 'onlineOrder'
        },
        {
          id: 2,
          label: '完成工单管理',
          route: 'accomplishOrder'
        },
        {
          id: 3,
          label: '库存状态明细',
          route: 'inventoryStatus'
        },
        {
          id: 4,
          label: '库存交易明细',
          route: 'inventoryTransaction'
        },
        {
          id: 5,
          label: '补货工单信息',
          route: 'replenishmentOrderInfo'
        },
        {
          id: 6,
          label: '违反绳规则',
          route: 'violateRule'
        },
        {
          id: 7,
          label: '生产缓冲颜色统计',
          route: 'productionColorStatistics'
        },
        {
          id: 8,
          label: '库存缓冲颜色统计',
          route: 'inventoryColorStatistics'
        },
        {
          id: 9,
          label: '生产周期统计',
          route: 'productionPeriodStatistics'
        }
      ]
    }
  },
  beforeMount () {
    this.activeRouter = this.$route.query.key
  },
  mounted () {
    this.activeRouter = this.$route.path.split('/')[this.$route.path.split('/').length - 1]
  },
  methods: {
    handleClick (tab) {
      let path = `/front/dataAnalysis/${tab.name}`
      this.$router.push({
        path: path,
        query: {
          key: tab.name
        }
      })
    }
  }
}
</script>

<style lang="sass">
  @import "dataAnalysis"
</style>
