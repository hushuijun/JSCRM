<template>
  <el-dialog :title="title"
             v-loading="loading"
             :visible.sync="visible"
             @close="handleCancel"
             :append-to-body="true"
             width="600px">
    <div class="handle-box">
       <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="caseId"
      label="案件编号"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="案件名称"
      >
    </el-table-column>
    <el-table-column
      prop="customerId"
      label="合同编号"
      >
    </el-table-column>
    <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
      </template>
    </el-table-column>
  </el-table>

       
    </div>
    <span slot="footer"
          class="dialog-footer">
       <!-- <el-pagination  style="float:right;margin:10px" -->
       <el-pagination
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="this.queryCondtion.page"
                       :page-sizes="pageSizes"
                       :page-size.sync="this.queryCondtion.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
    </span>
  </el-dialog>
</template>

<script>

import { queryPageListCase } from '@/api/jscrm/money/comm'
export default {
  /** 客户管理 的 勾选后的 团队成员 操作 移除操作不可移除客户负责人*/
  name: 'teams-handle',
  components: {
  },
  data() {
    return {
      tableData:[{"caseId":3,"name":"案件标题","customerId":3},{"caseId":3,"name":"案件标题","customerId":3},{"caseId":3,"name":"案件标题","customerId":3}],
      loading: false, // 加载动画
      visible: false,
      title:'选择案件',
      queryCondtion:{
        page: 1,
        limit: 5,
        billType:null,
        handPersonName:null,
        caseId:null,
        caseName:null,
      },
      total:0,
      pageSizes: [5,10, 20, 30, 40],
    }
  },
  computed: {},
  create(){

  },
  mounted() {
    this.getList();
  },

  methods: {

    /** 获取列表数据 */
    getList() {
      this.loading = true
      queryPageListCase(this.queryCondtion)
        .then(res => {
          this.tableData = res.data.list

          this.total = res.data.totalRow
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * 取消选择
     */
    handleCancel() {
      this.visible = false
      // this.$emit('update:dialogVisible', false)
    },

    handleClick(row) {
      this.$emit('getDataCase',row);
      this.visible = false;
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
 
  }
}
</script>

<style lang="scss" scoped>
.handle-box {
  color: #333;
  font-size: 12px;
}
</style>
