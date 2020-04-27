<template>
    <div class="cost">
      <el-table
        :data="costList"
        border
        style="width: 100%">
        <el-table-column
        prop="caseNum"
        label="费用编号"
        width="138" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="contractId"
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
        <!-- <el-table-column
        prop="status"
        label="审核状态"
        width="120" show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip
                         prop="checkStatus"
                         label="审核状态"
                         :resizable="false"
                         width="100"
                         align="center"
                         fixed="right">
        <template slot="header"
                  slot-scope="scope">
          <div class="table-head-name">{{scope.column.label}}</div>
        </template>
        <template slot-scope="scope">
          <div class="status_button"
                :style="getStatusStyle(scope.row.checkStatus)">
            {{getStatusName(scope.row.checkStatus)}}
          </div>
        </template>
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
  },
  methods: {
    getStatusStyle(status) {
      if (status == 0 || status == null) {
        return {
          'border-color': '#E6A23C',
          'background-color': '#FDF6EC',
          'color': '#E6A23C'
        }
      } else if (status == 1) {
        return {
          'border-color': '#409EFF',
          'background-color': '#ECF5FF',
          'color': '#409EFF'
        }
      } else if (status == 2) {
        return {
          'border-color': '#67C23A',
          'background-color': '#F0F9EB',
          'color': '#67C23A'
        }
      } else if (status == 3) {
        return {
          'border-color': '#F56C6B',
          'background-color': '#FEF0F0',
          'color': '#F56C6B'
        }
      } else if (status == 4) {
        return {
          'background-color': '#FFFFFF'
        }
      }
    },
    getStatusName(status) {
      if (status == 0 || status == null) {
        // return '待审核'
        return '未提交'
      } else if (status == 1) {
        return '审核中'
      } else if (status == 2) {
        return '通过'
      } else if (status == 3) {
        return '拒绝'
      } else if (status == 4) {
        return '撤回'
      }
      return ''
    },
  }
}
</script>
<style lang="scss" scoped>
.cost {
  padding: 20px;
}
.status_button {
  padding: 1px 6px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  margin: 0 auto;
}
</style>