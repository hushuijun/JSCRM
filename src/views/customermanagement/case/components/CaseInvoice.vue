<template>
    <div class="invoice">
      <el-table
        :data="list"
        border
        style="width: 100%">
        <el-table-column
        prop="invoiceDate"
        label="开票日期"
        width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="billType"
        label="票据类型"
        width="120">
        </el-table-column>
        <el-table-column
        prop="invoiceMoney"
        label="开票金额">
        </el-table-column>
          <el-table-column
        prop="billNo"
        label="发票号码">
        </el-table-column>
          <el-table-column
        prop="createUserName"
        label="所属人员">
        </el-table-column>
        <el-table-column
        prop="handPersonName"
        label="发票经手人员" width="120">
        </el-table-column>
        <el-table-column
        prop="remarks"
        label="备注" width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          type="operation">
          <template slot-scope="scope">
            <!-- <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button> -->
            <el-button @click="detailClick(scope.row)" type="text" size="small">附件</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
import {
  crmCaseInvoiceIndex
} from '@/api/customermanagement/case'
export default {
  /** 客户管理 的 合同详情 的 跟进记录*/
  name: 'case-invoice',
  props: {
      id: [Number, String]
  },
  data () {
      return {
          list: []
      }
  },
  mounted() {
    this.getInvoiceList()
  },
  methods: {
      getInvoiceList () {
          crmCaseInvoiceIndex({caseId: this.id}).then((res) => {
              this.list = res.data.list
          })
      },
      detailClick () {

      }
  }
}
</script>
<style lang="scss" scoped>
.invoice {
    padding: 20px;
    td {
        div {
            text-align: center;
        }
    }
}
</style>