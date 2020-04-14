<template>
  <el-dialog :title="title"
             v-loading="loading"
             :visible.sync="visible"
             @close="handleCancel"
             :append-to-body="true"
             width="600px">
    <div class="handle-box">

     <div style="margin-bottom:5px">
                <span style="margin-left:10px">案件编号</span> <el-input v-model="queryCondtion.caseId" placeholder="请输入" class="input_width"></el-input>
                <span style="margin-left:10px">案件名称</span> <el-input v-model="queryCondtion.caseName" placeholder="请输入" class="input_width"></el-input>
                <span style="margin-left:10px">合同名称</span> <el-input v-model="queryCondtion.contractName" placeholder="请输入" class="input_width"></el-input>

                <el-button  @click="getList()" style="float:right">查询</el-button>
      </div>

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
      prop="caseName"
      label="案件名称"
      >
    </el-table-column>
    <el-table-column
      prop="contractName"
      label="合同名称"
      >
    </el-table-column>
    <el-table-column
      prop="realname"
      label="负责人"
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

import { selectPageCase } from '@/api/jscrm/money/comm'
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
        caseId:null,
        caseName:null,
        contractName:null,
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
      selectPageCase(this.queryCondtion)
        .then(res => {
          console.log(this.queryCondtion);
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
      console.log(row);
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

.input_width {
  width: 100px;
}
</style>
