<template>
  <el-dialog :title="title"
             v-loading="loading"
             :visible.sync="visible"
             @close="handleCancel"
             :append-to-body="true"
             width="600px">
    <div class="handle-box">

      <div style="margin-bottom:5px">
                <span style="margin-left:10px;font-size:13px">姓名</span> <el-input v-model="queryCondtion.realname" placeholder="请输入" class="input_width"></el-input>
                <span style="margin-left:10px;font-size:13px">手机号</span> <el-input v-model="queryCondtion.mobile" placeholder="请输入" class="input_width"></el-input>

                <el-button  @click="getList()" type="primary" style="margin-left:30px">查询</el-button>
      </div>

       <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="userId"
      label="编号"
      width="50px"
      >
    </el-table-column>
    <el-table-column
      prop="realname"
      label="名称"
      width="80px"
      >
    </el-table-column>
    <el-table-column
      prop="mobile"  width="110px"
      label="手机号"
      >
    </el-table-column>
    <el-table-column
      prop="deptName"
      label="部门"
      >
    </el-table-column>
    <el-table-column
      prop="post"
      label="岗位"
      width="120px"
      >
    </el-table-column>
    <el-table-column
      label="操作" width="60px"
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

import {
  usersList,
} from '@/api/common'
export default {
  /** 客户管理 的 勾选后的 团队成员 操作 移除操作不可移除客户负责人*/
  name: 'teams-handle',
  components: {
  },
  data() {
    return {
      tableData:[],
      loading: false, // 加载动画
      visible: false,
      title:'选择用户',
      queryCondtion:{
        page: 1,
        limit: 5,
        realname:null,
        mobile:null,
      },
      total:0,
      pageSizes: [5,10, 20, 30, 40],
    }
  },
  computed: {},
  mounted() {
    this.getList();
  },
  methods: {

    /** 获取列表数据 */
    getList() {
      this.loading = true
      usersList(this.queryCondtion)
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
      this.$emit('getDataUser',row);
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
  width: 130px;
}
</style>
