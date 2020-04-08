<template>
  <div>
      案件管理
  </div>
</template>

<script>
// import ClueDetail from './ClueDetail'
// import CRMCreateView from '../components/CRMCreateView'
import table from '../mixins/table'
// import table from '../mixins/detail'

export default {
  /** 客户管理 的 线索列表 */
  name: 'caseIndex',
  components: {
  },
  mixins: [table],
  data() {
    return {
      
    }
  },
  computed: {},
  mounted() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
</style>
