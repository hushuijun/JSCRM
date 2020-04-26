<template>
  <div class="se-container">
    <div class="main-title">分润管理</div>

        <div class="input-container">
        <span>类型</span> <el-select v-model="queryCondtion.type" size="small" clearable placeholder="请选择">
                <el-option
                  key="员工"
                  label="员工"
                  value="员工">
                </el-option>  
                <el-option
                  key="合伙人"
                  label="合伙人"
                  value="合伙人">
                </el-option>  
                <el-option
                  key="商家"
                  label="商家"
                  value="商家">
                </el-option>  
                <el-option
                  key="兼职"
                  label="兼职"
                  value="兼职">
                </el-option>  
               </el-select>  
        </div>       
        <div class="input-container">
        <span>标题</span> <el-input v-model="queryCondtion.title" size="small" placeholder="请输入标题"></el-input>
        </div>
        <el-button  @click="getList()"  type="primary" icon="el-icon-search" >搜索</el-button>
        <el-button 
                   @click="addData"
                   icon="el-icon-plus"
                   type="warning"  style="background-color: #ff6a00;border-color: #ff6a00;">新建分润</el-button>
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
                style="width: 100%"
               >
       
        <el-table-column prop="title" label="标题" align="center" header-align="center"></el-table-column>
        <el-table-column prop="type" label="分润类型" align="center" header-align="center"></el-table-column>
        <el-table-column prop="ratio" label="分润占比" :formatter="ratioFormat"align="center" header-align="center"></el-table-column>
        <el-table-column prop="createTime" label="时间" :formatter="dateFormat" align="center" header-align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center" header-align="center"></el-table-column>

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
            <el-button @click="handleClick('change', scope)"
                       type="text"
                       size="small">{{scope.row['state'] === '停用' ? '启用' : '停用'}}</el-button>
            
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
    <create-share v-if="createView"
                           @save="getList"
                           @hiden-view="createView=false"></create-share>
    <update-share v-if="updateView"
                           :detailData="detailData"
                           @update="getList"
                           @hiden-view="updateView=false"></update-share>

    
  </div>
</template>

<script>
import CreateShare from './components/CreateShare'
import UpdateShare from './components/UpdateShare'
import * as fecha from "element-ui/lib/utils/date"
import {
  queryPage,
  deleteData,
  checkPass,
  checkReturn,
} from '@/api/jscrm/money/shareManage'
import { timestampToFormatTime } from '@/utils'

export default {
  /** 系统管理 的 审核管理 */
  name: 'system-examine',
  components: {
    CreateShare,
    UpdateShare,
  },
  mixins: [],
  data() {
    return {
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
        title:null,
        type:null,
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

    
    ratioFormat(row,column,cellValue){
      return cellValue+"%";
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
      } else if (type === 'change') {
        const status = scope.row['state'];
        // 启用停用
        this.$confirm(
          '您确定要' +
            (scope.row['state'] === '停用' ? '启用' : '停用') +
            '该记录?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            if(status=='停用'){
              checkPass({
                id: scope.row['id'],
                status: scope.row['state'] === '停用' ? '启用' : '停用'
              })
                .then(res => {
                  scope.row['state'] = scope.row['state'] === '停用' ? '启用' : '停用'
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                })
                .catch(() => {})
            }else{
               checkReturn({
                id: scope.row['id'],
                status: scope.row['state'] === '停用' ? '启用' : '停用'
              })
                .then(res => {
                  scope.row['state'] = scope.row['state'] === '停用' ? '启用' : '停用'
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                })
                .catch(() => {})
            }
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
