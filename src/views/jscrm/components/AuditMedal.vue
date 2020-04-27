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
      <el-table-column width="162" property="name" label="审批流程名称"></el-table-column>
      <el-table-column width="162" property="typeText" label="流程类型"></el-table-column>
      <el-table-column width="60px"
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
    </span>
  </el-dialog>
</template>

<script>

import { crmContractTemplate } from '@/api/customermanagement/contract'
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
      title:'请选择审核模板',
      queryCondtion:{
        // page: 1,
        // limit: 5,
        // caseId:null,
        // caseName:null,
        // contractName:null,
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
      crmContractTemplate(this.queryCondtion)
        .then(res => {
          res.data.list.forEach((value) => {
              if (value.examineType == 1) {
                  value.typeText = '固定审批'
              } else if (value.examineType == 2) {
                  value.typeText = '授权审批'
              }
          })
          this.tableData = res.data.list
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
      this.$emit('getDataAudit',row);
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
  font-size: 14px;
}

.input_width {
  width: 100px;
}
</style>
