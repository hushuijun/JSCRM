<template>
  <el-dialog
             v-loading="loading"
             :visible.sync="visible"
             @close="handleCancel"
             :append-to-body="true"
             width="800px">
    <div class="handle-box">
      <!-- <flexbox class="handle-item">
        <xh-user-cell class="handle-item-content"
                      placeholder="点击选择"
                      @value-change="userChage"></xh-user-cell>
        <div class="handle-item-name">选择人员</div>
      </flexbox> -->
      <!-- <flexbox class="handle-item"> -->
      <div class="people-info">人员信息</div>
      <div class="transfer-search">
        <span>人员姓名</span>
        <el-input
          placeholder=""
          label="人员姓名" size="mini" type="text" v-model="realName">
        </el-input>
        <span>手机号</span>
        <el-input
          placeholder=""
          label="手机号" size="mini" type="text" v-model="mobile">
        </el-input>
      </div>
      <el-row class="search-btn">
        <el-button type="primary" @click="getUsersByCondition()">搜索</el-button>
      </el-row>
      <!-- </flexbox> -->
      <!-- <flexbox class="handle-item"
               v-if="showRemoveType">
        <div class="handle-item-name">将原负责人：</div>
        <el-radio-group v-model="removeType">
          <el-radio :label="1">移出</el-radio>
          <el-radio :label="2">转为团队成员</el-radio>
        </el-radio-group>
      </flexbox> -->
      <!-- <flexbox v-if="removeType == 2"
               class="handle-item">
        <div class="handle-item-name">权限：</div>
        <el-radio-group v-model="handleType">
          <el-radio :label="1">只读</el-radio>
          <el-radio :label="2">读写</el-radio>
        </el-radio-group>
      </flexbox> -->
      <!-- 仅客户下可进行同时变成负责人 -->
      <!-- <flexbox class="handle-item"
               v-if="crmType === 'customer'">
        <div class="handle-item-name">同时变更负责人至：</div>
        <el-checkbox-group v-model="addsTypes">
          <el-checkbox label="1">联系人</el-checkbox>
          <el-checkbox label="2">商机</el-checkbox>
          <el-checkbox label="3">合同</el-checkbox>
        </el-checkbox-group>
      </flexbox> -->
       <!-- :data="tableData" -->
      <el-table
        :data="conditionUsers"
        style="width: 100%;height:280px;overflow-y:scroll;margin-top: 15px;" border>
          <el-table-column
            label="姓名"
            prop="realname"
            width="180">
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            width="180">
          </el-table-column>
          <el-table-column
            label="部门"
            prop="deptName"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作"
            prop="确认"
            width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleConfirm(scope.row)">确认</el-button>
             </template>
          </el-table-column>
      </el-table>
    </div>
    <!-- <span slot="footer"
          class="dialog-footer">
      <el-button @click.native="handleCancel">取消</el-button>
      <el-button type="primary"
                 @click.native="handleConfirm">保存</el-button>
    </span> -->
  </el-dialog>
</template>

<script>
import { XhUserCell } from '@/components/CreateCom'
import { crmCustomerTransfer, getUserByCondition} from '@/api/customermanagement/customer'
import { crmContactsTransfer } from '@/api/customermanagement/contacts'
import { crmBusinessTransfer } from '@/api/customermanagement/business'
import { crmContractTransfer } from '@/api/customermanagement/contract'
import { crmLeadsTransfer } from '@/api/customermanagement/clue'

export default {
  /** 客户管理 的 勾选后的 转移 操作*/
  name: 'transfer-handle',
  components: {
    XhUserCell
  },
  mixins: [],
  watch: {
    dialogVisible: {
      handler(val) {
        this.visible = val
        if (val) {
        }
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    /** 转移数据 */
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false, // 加载动画
      visible: false,
      usersList: [], // 变更负责人
      removeType: 1, // 移动类型
      handleType: 1, // 操作类型
      addsTypes: [], // 添加至
      conditionUsers: [],
      realName: '',
      mobile: ""
    }
  },
  created () {
    this.getUsersByCondition()
  },
  computed: {
    // 是否展示移除操作类型
    showRemoveType() {
      if (this.crmType == 'leads' || this.crmType == 'contacts') {
        return false
      }
      return true
    }
  },
  mounted() {
    this.visible = this.dialogVisible
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.visible = false
      this.$emit('update:dialogVisible', false)
    },
    /** 负责人更改 */
    userChage(data) {
      this.usersList = data.value
    },
    handleConfirm(user) {
      // if (this.usersList.length === 0) {
      //   this.$message.error('请选择变更负责人')
      // } else {
      this.loading = true
      this.getRequest()(this.getParams(user.userId))
        .then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.loading = false
          this.handleCancel()
          this.$emit('handle', { type: 'transfer' })
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },
    getUsersByCondition() {
      getUserByCondition({
        "realName": this.realName,
        "mobile": this.mobile
      }).then(res => {
        this.conditionUsers = res.data
      })
    },
    getRequest() {
      if (this.crmType === 'leads') {
        return crmLeadsTransfer
      } else if (this.crmType === 'customer') {
        return crmCustomerTransfer
      } else if (this.crmType === 'contacts') {
        return crmContactsTransfer
      } else if (this.crmType === 'business') {
        return crmBusinessTransfer
      } else if (this.crmType === 'contract') {
        return crmContractTransfer
      }
    },
    getParams(userId) {
      // var ownerUserId = this.usersList[0].userId
      var ownerUserId = userId
      var params = {
        newOwnerUserId: ownerUserId,
        // transferType: this.removeType
      }
      // if (this.removeType === 2) {
        // 1移出，2转为团队成员
        // params.power = this.handleType
      // }
      var self = this
      var actionId = this.selectionList.map(function(item, index, array) {
        return item[self.crmType + 'Id']
      })
      params[this.crmType + 'Ids'] = actionId.join(',')
      // if (this.crmType === 'customer') {
        // 只有客户下面有同时变更
        // params.changeType = this.addsTypes.join(',')
      // }
      return params
    }
  }
}
</script>

<style lang="scss" scoped>
.handle-box {
  color: #333;
  font-size: 14px;
  .el-input--mini {
    width: 150px;
    display: inline-block;
  }
  .people-info {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .transfer-search {
    display: inline-block;
  }
  .search-btn {
    display: inline-block;
    margin-left: 15px;
  }
}
.handle-item {
  padding-bottom: 15px;
  .handle-item-name {
    flex-shrink: 0;
    width: 110px;
    margin-left: 15px;
    font-size: 16px;
  }
  .handle-item-content {
    flex: 1;
  }
}
.handle-bar {
  position: relative;
  margin-top: 10px;
  height: 30px;
  button {
    float: right;
    margin-right: 10px;
  }
}
</style>
