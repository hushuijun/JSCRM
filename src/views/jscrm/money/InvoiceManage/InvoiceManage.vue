<template>
  <div class="se-container">
    <div class="main-title">发票管理</div>
    
    <div class="input-container">
        <span >发票类型</span> <el-select v-model="queryCondtion.billType" size="small" style="width: 150px;" clearable placeholder="请选择">
                 <el-option
                  v-for="item in billTyppNum"
                  :key="item.code"
                  :label="item.code"
                  :value="item.code"
                  >
                </el-option>
               </el-select>  </div>
               <div class="input-container">
        <span >负责人</span> <el-input v-model="queryCondtion.handPersonName" placeholder="请输入" size="small"></el-input>
                 </div>
               <div class="input-container">
        <span >案件编码</span> <el-input v-model="queryCondtion.caseNum" placeholder="请输入" size="small"></el-input>
                 </div>
               <div class="input-container">
        <span >案件名称</span> <el-input v-model="queryCondtion.caseName" placeholder="请输入" size="small"></el-input>
                 </div>
        <el-button  @click="getList()"  type="primary">搜索</el-button>
        <el-button 
                   @click="addData"
                   type="primary" >新增</el-button>

      <div class="se-body">
      <el-table class="main-table"
                id="examine-table"
                v-loading="loading"
                :data="list"
                :height="tableHeight"
                 stripe
                border
                highlight-current-row
                style="width: 100%"
               >
       
        <el-table-column prop="caseNum" label="案件编号" width="150px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="caseName" label="案件名称"  width="100px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="invoiceDate" label="开票日期"  width="100px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="billType" label="票据类型" width="140px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="invoiceMoney" label="开票金额" width="100px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="billNo" label="发票号码" width="100px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="handPersonName" label="所属人员" width="100px" align="center" header-align="center"></el-table-column>
        <el-table-column prop="createUserName" label="发票经手人员" width="100px" align="center" header-align="center"></el-table-column>

        <el-table-column 
                         label="操作"
                         >
          <template slot-scope="scope">
            <el-button @click="handleClick('edit', scope)"
                       type="text"
                       size="small">编辑</el-button>
            <el-button @click="handleClick('delete', scope)"
                       type="text"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-contianer">
        <el-pagination class="p-bar"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="this.queryCondtion.page"
                       :page-sizes="pageSizes"
                       :page-size.sync="this.queryCondtion.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <create-invoice v-if="createView"
                           @save="getList"
                           @hiden-view="createView=false"></create-invoice>
    <update-invoice v-if="updateView"
                           :detailData="detailData"
                           @update="getList"
                           @hiden-view="updateView=false"></update-invoice>

    
  </div>
</template>

<script>
import CreateInvoice from './components/CreateInvoice'
import UpdateInvoice from './components/UpdateInvoice'
import {billTyppNum}from '@/views/jscrm/money/const/const'
import * as fecha from "element-ui/lib/utils/date"


import {
  queryPage,
  deleteData,
} from '@/api/jscrm/money/InvoiceManage'
import { timestampToFormatTime } from '@/utils'

export default {
  /** 系统管理 的 审核管理 */
  name: 'system-examine',
  components: {
    CreateInvoice,
    UpdateInvoice,
  },
  mixins: [],
  data() {
    return {
      billTyppNum:billTyppNum,
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 240, // 表的高度
      list: [],
      pageSizes: [5,10, 20, 30, 40],
      total: 0,
      /** 展示操作框 */
      createView: false,
      updateView:false,
      // 详情展示
      showDetail: false,
      detailData: {},
      queryCondtion:{
        page: 1,
        limit: 10,
        billType:null,
        handPersonName:null,
        caseNum:null,
        caseName:null,
      },
    }
  },
  computed: {},
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      self.tableHeight = document.documentElement.clientHeight - 240
    }

    this.getList()
  },
  methods: {
    dateFormat(row,column,cellValue){
      return cellValue ? fecha.format(new Date(cellValue),'yyyy-MM-dd'):'';
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true
      queryPage(this.queryCondtion)
        .then(res => {
          console.log(this.queryCondtion);
          this.list = res.data.list

          this.total = res.data.totalRow
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    
    /**
     *  添加记录
     */
    addData() {
      this.createView = true
    },
    /** 列表操作 */
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      if (column.property) {
        this.detailData = row
        this.showDetail = true
      }
    },
    // 更改每页展示数量
    handleSizeChange(val) {
      this.queryCondtion.limit = val
      this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.queryCondtion.page = val
      this.getList()
    },
    handleClick(type, scope) {
      if (type === 'edit') {
        this.detailData.id = scope.row.id
        this.updateView = true
      } else if (type === 'delete') {
        // 启用停用
        this.$confirm('您确定要删除该记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteData({
              id: scope.row['id']
            })
              .then(res => {
                this.list.splice(scope.$index, 1)
                this.getList()
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.se-header {
  height: 60px;
  position: relative;
  z-index: 100;
  padding: 0 20px;
  font-size: 18px;
  line-height: 60px;
}

.se-body {
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
}

.se-table-header {
  height: 50px;
  background-color: white;
  position: relative;
  .se-table-header-button {
    float: right;
    margin-right: 20px;
    margin-top: 10px;
  }
  margin-top: 10px
}

.p-contianer {
  position: relative;
  background-color: white;
  height: 44px;
  .p-bar {
    float: right;
    margin: 5px 100px 0 0;
    font-size: 14px !important;
  }
}

// hyf开始

.input_width {
  width: 100px;
}

.input-container {
  width: 230px;
  display: inline-block;
  margin-bottom: 20px;
}

.el-input--small{
  width: 150px;
  display: inline-block;
}

.main-title {
  font-size: 20px;
  padding: 20px 0;
}

// @import '../styles/table.scss';
</style>
