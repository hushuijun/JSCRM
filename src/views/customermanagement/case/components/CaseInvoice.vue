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
        width="120"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="invoiceMoney"
        label="开票金额"
        show-overflow-tooltip>
        </el-table-column>
          <el-table-column
        prop="billNo"
        show-overflow-tooltip
        width="120"
        label="发票号码">
        </el-table-column>
          <el-table-column
        prop="createUserName"
        label="所属人员"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="handPersonName"
        label="发票经手人员" width="120"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        prop="remarks"
        label="备注" width="120"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="60"
          type="operation">
          <template slot-scope="scope">
            <!-- <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button> -->
            <el-button @click.stop="previewFile(scope.row)" type="text" size="small">附件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-popover
        placement="right"
        v-model="isShow" class="popStyle">
        <div class="title">附件列表</div>
        <div class="close-detail el-icon-close" @click="isShow=false"></div>
        <el-table :data="fileList" style="width: 100%; height: 250px">
          <el-table-column width="160" property="name" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column width="130" property="createUserName" label="上传人" show-overflow-tooltip></el-table-column>
          <el-table-column width="160" property="createTime" label="时间" show-overflow-tooltip></el-table-column>
          <el-table-column width="150" property="size" label="大小" show-overflow-tooltip></el-table-column>
          <el-table-column
          fixed="right"
          label="操作"
          width="60"
          type="operation">
          <template slot-scope="scope">
            <!-- <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button> -->
          <div class="fl-b-img-item"
             v-for="(file, index) in [scope.row]"
             :key="file.filePath"
             @click="previewImg([scope.row], index)">预览</div>
            <!-- <el-button @click="previewFile(scope.row)" type="text" size="small">预览</el-button> -->
          </template>
          </el-table-column>
        </el-table>
      </el-popover>
    </div>
</template>
<script>
import {
  crmCaseInvoiceIndex
} from '@/api/customermanagement/case'
import {
  crmFileIndexNew
} from '@/api/common'
export default {
  /** 客户管理 的 合同详情 的 跟进记录*/
  name: 'case-invoice',
  props: {
      id: [Number, String]
  },
  data () {
      return {
          list: [],
          fileList: [],
          isShow: false,
          imgs: []
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
      previewFile (info) {
        let batchId = info.batchId
        // let batchId = 'e2f90567400943e3aa11aea9875d412d'
        this.isShow = true
        crmFileIndexNew(batchId).then(res => {
          this.loading = false
          res.data.forEach((element) => {
            element.type = element.name.split('.')[1]
          })
          this.fileList = res.data
        })
        .catch(() => {
          this.loading = false
        })
      },
      previewImg(list, index) {
        this.$bus.emit('preview-image-bus', {
          index: index,
          data: list.map(function(item, index, array) {
            item.url = item.filePath
            return item
          })
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.invoice {
    height: 100%;
    padding: 20px;
    td {
        div {
            text-align: center;
        }
    }
    .popStyle {
      width: 660px; 
      height: 250px;
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translate(-50%, 0);
      z-index: 9;
    }
    .el-icon-close:before {
      font-size: 30px;
      color: #666;
      position: fixed;
      right: -12px;
      top: 10px;
      z-index: 99;
    }
    .fl-b-img-item {
      color: #3E84E9;
    }
}
</style>