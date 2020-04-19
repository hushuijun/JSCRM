<template>
  <div class="se-container">
    <div class="se-header">费用管理</div>
    <div class="se-body">
      <div class="se-table-header">

        <span style="margin-left:10px">合同编号</span> <el-input v-model="queryCondtion.contractId" placeholder="请输入" class="input_width"></el-input>
        <el-button 
                   @click="addData"
                   type="primary" style="float:right;margin:0px 10px">新增</el-button>
        <el-button  @click="getList()" style="float:right">搜索</el-button>
      </div>
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
       
        <el-table-column prop="id" label="费用编号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="contractId" label="合同编号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="caseId" label="案件编号"  align="center" header-align="center"></el-table-column>
        <el-table-column prop="costMoney" label="金额" align="center" header-align="center"></el-table-column>
        <el-table-column prop="costDate" label="时间" align="center" :formatter="dateFormat" header-align="center"></el-table-column>
        <el-table-column prop="applyUserName" label="负责人" align="center" header-align="center"></el-table-column>
        <el-table-column prop="formType" label="填单类型" align="center" header-align="center"></el-table-column>
        <el-table-column prop="status" label="审核状态"  align="center" header-align="center"></el-table-column>

        <el-table-column fixed="right"
                         label="操作"
                         width="250">
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
    <create-Cost v-if="createView"
                           @save="getList"
                           @hiden-view="createView=false"></create-Cost>
    <update-Cost v-if="updateView"
                           :detailData="detailData"
                           @update="getList"
                           @hiden-view="updateView=false"></update-Cost>

    
  </div>
</template>

<script>
import CreateCost from './components/CreateCost'
import UpdateCost from './components/UpdateCost'
import {billTyppNum}from '@/views/jscrm/money/const/const'
import * as fecha from "element-ui/lib/utils/date"


import {
  queryPage,
  deleteData,
} from '@/api/jscrm/money/CostManage'
import { timestampToFormatTime } from '@/utils'

export default {
  /** 系统管理 的 审核管理 */
  name: 'system-examine',
  components: {
    CreateCost,
    UpdateCost,
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

// @import '../styles/table.scss';
</style>
