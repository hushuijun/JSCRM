<template>
    <div class="cost">
      <el-table
        :data="costList"
        border
        style="width: 100%">
        <el-table-column
        prop="invoiceDate"
        label="费用编号"
        width="138" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="invoiceDate"
        label="合同编号"
        width="138" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="costMoney"
        label="金额"
        width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="costDate"
        label="时间"
        width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="applyUserName"
        label="负责人"
        width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="formType"
        label="填单类型"
        width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="status"
        label="审核状态"
        width="120" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
import {
  crmCaseCostIndex
} from '@/api/customermanagement/case'
export default {
  /** 客户费用 的 合同详情 的 跟进记录*/
  name: 'case-cost',
  data () {
      return {
        costList: []
      }
  },
  props: {
    id: [String, Number]
  },
  mounted () {
    crmCaseCostIndex({caseId: this.id}).then((res) => {
      this.costList = res.data.list
    })
  }
}
</script>
<style lang="scss" scoped>
.cost {
  padding: 20px;
}

</style>