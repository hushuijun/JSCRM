<template>
  <div class="se-container">
    <div class="main-title">回款计划列表</div>
    
        <div class="input-container">
          <span style="margin-left:10px">合同编号</span> <el-input v-model="queryCondtion.contractId" placeholder="请输入" size="small"></el-input>
        </div>
        <div class="input-container">
         <span style="margin-left:10px">客户名称</span> <el-input v-model="queryCondtion.customerName" placeholder="请输入" size="small"></el-input>
        </div>
        <div class="input-container">
           <span style="margin-left:10px">公司名称</span> <el-input v-model="queryCondtion.customerCompanyName" placeholder="请输入" size="small"></el-input>
        </div>
         <div class="input-container" style="width: 250px;">
        <span style="margin-left:10px">回款开始日期</span> 
        <el-date-picker
          v-model="queryCondtion.startDate" value-format="yyyy-MM-dd"
          type="date" style="width: 140px"
          placeholder="选择日期">
        </el-date-picker>
        </div>
         <div class="input-container"  style="width: 250px;">
        <span style="margin-left:10px">回款结束日期</span> 
        <el-date-picker
          v-model="queryCondtion.endDate" value-format="yyyy-MM-dd"
          type="date" style="width: 140px"
          placeholder="选择日期">
        </el-date-picker>
        </div>
         <div class="input-container">
        <span style="margin-left:10px">负责人</span> <el-input v-model="queryCondtion.handPersonName" placeholder="请输入" size="small"></el-input>
        </div>
        <!-- <el-button  @click="getList()"  type="primary">搜索</el-button>
        <el-button 
                   @click="addData"
                   type="primary" >新增</el-button> -->
      <div class="se-body">
      <el-table class="main-table"
                id="examine-table"
                v-loading="loading"
                :data="list"
                :height="tableHeight"
                 stripe
                border
                :header-cell-style="{color:'#333',background: '#fafdff',fontWeight:700}"
                highlight-current-row
                style="width: 100%;"
               >
       
        <el-table-column prop="customerName" label="客户名称"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="customerCompanyName" label="客户公司名称"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="contractId" label="合同编号"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="money" label="计划回款金额"   align="center" header-align="center"></el-table-column>
        <el-table-column prop="num" label="期数"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="returnDate" label="回款日期"  :formatter="dateFormat" align="center" header-align="center"></el-table-column>
        <el-table-column prop="returnType" label="汇款方式"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="remind" label="提前几日提醒"  align="center" header-align="center"></el-table-column>

        <el-table-column fixed="right"
                         label="操作"
                         >
          <template slot-scope="scope">
            <el-button @click="handleClick('edit', scope)"
                       type="text"
                       size="small">预览</el-button>
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
    <update-RemittancePlanList v-if="updateView"
                           :detailData="detailData"
                           @update="getList"
                           @hiden-view="updateView=false"></update-RemittancePlanList>

    
  </div>
</template>

<script>
import UpdateRemittancePlanList from './components/UpdateRemittancePlanList'
import {billTyppNum}from '@/views/jscrm/money/const/const'
import * as fecha from "element-ui/lib/utils/date"


import {
  queryPagePlan,
} from '@/api/jscrm/money/RemittancePlan'
import { timestampToFormatTime } from '@/utils'

export default {
  /** 系统管理 的 审核管理 */
  name: 'system-examine',
  components: {
    UpdateRemittancePlanList,
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
        contractId:null,
        customerName:null,
        customerCompanyName:null,
        handPersonName:null,
        startDate:null,
        endDate:null,
        // type:1,  //实际还款
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
      queryPagePlan(this.queryCondtion)
        .then(res => {
          this.list = res.data.list

          this.total = res.data.totalRow
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    
    /**
     *  添加审批流
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
        this.detailData = scope.row
        this.updateView = true
      } else if (type === 'delete') {
        // 启用停用
        this.$confirm('您确定要删除该审批流?', '提示', {
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
  height: 80px;
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
  height: 60px;
    font-size: 18px;
    padding: 0 20px;
    line-height: 60px;
    font-weight: 700;
}

// @import '../styles/table.scss';
</style>
