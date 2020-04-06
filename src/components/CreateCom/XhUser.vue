<template>
  <div class="user-select">
    <div class="input-container">
      <span class="search-text">客户姓名</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="realname">
      </el-input>
    </div>
    <div class="input-container">
      <span class="search-text">手机号</span>
      <el-input
        placeholder=""
        label="手机号" size="small" v-model="mobile">
      </el-input>
    </div>
    <el-row class="customer-search">
      <el-button type="primary" @click="getUsersByCondition()">搜索</el-button>
    </el-row>
    <el-table
        :data="list"
        style="width: 560px;height:280px;overflow-y:scroll;margin-top: 15px;" border>
          <el-table-column
            label="姓名"
            prop="realname"
            width="150">
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobile"
            width="150">
          </el-table-column>
          <el-table-column
            label="部门"
            prop="deptName"
            width="150">
          </el-table-column>
          <el-table-column
            label="操作"
            prop="确认"
            width="80">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleConfirm(scope.row)">确认</el-button>
             </template>
          </el-table-column>
      </el-table>
    <!-- <el-input placeholder="搜索成员"
              size="small"
              v-model="searchInput"
              suffix-icon="el-icon-search"
              @input="inputchange">
    </el-input>
    <div v-loading="loading"
         class="search-list">
      <el-checkbox-group v-model="selectItems"
                         @change="changeCheckout">
        <el-checkbox v-if="item.show"
                     v-for="(item, i) in list"
                     :key="i"
                     :label="item"
                     :disabled="item.disabled"
                     class="colleagues-list">
          <div v-photo="item"
               v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
               class="div-photo search-img"></div>
          <span>{{item.realname}}</span>
        </el-checkbox>
      </el-checkbox-group>
    </div> -->
  </div>
</template>
<script type="text/javascript">
import { usersList } from '@/api/common'
import { getUserByCondition} from '@/api/customermanagement/customer'

export default {
  name: 'xh-user', // 新建 user
  components: {},
  computed: {},
  watch: {
    selectedData: function(value) {
      this.checkItems(value)
    }
  },
  data() {
    return {
      list: [],
      selectItems: [], // 选择项
      loading: false, // 加载动画
      searchInput: '',
      realname: '',
      mobile: ''
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    /** 多选框 只能选一个 */
    radio: {
      type: Boolean,
      default: false
    },
    /** 已选信息 */
    selectedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    /** 获取不同的员工展示列表 */
    infoType: {
      type: String,
      default: 'default' //返回全部  crm_contract crm_receivables oa_examine 合同审核人自选列表
    },
    infoRequest: Function,
    /** 请求辅助参数 */
    infoParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取员工列表
    getUserList() {
      this.loading = true
      this.getRequest()(this.getParams())
        .then(res => {
          var self = this
          this.list = res.data.map(function(item, index, array) {
            item.disabled = false // 要求单选
            item.show = true
            if (self.selectedData.length > 0) {
              let disabled = true
              for (let index = 0; index < self.selectedData.length; index++) {
                const element = self.selectedData[index]
                if (element.userId == item.userId) {
                  disabled = false
                  self.selectItems.push(item)
                }
              }
              if (self.radio) {
                item.disabled = disabled
              }
            }
            return item
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getRequest() {
      if (this.infoRequest) {
        return this.infoRequest
      } else if (this.infoType === 'default') {
        return usersList
      } else if (
        this.infoType === 'crm_contract' ||
        this.infoType === 'crm_receivables' ||
        this.infoType === 'oa_examine'
      ) {
        return usersList
      }
    },
    //搜索
    getUsersByCondition () {
      getUserByCondition({
        "realName": this.realname,
        "mobile": this.mobile
      }).then(res => {
        this.list = res.data
        console.log(this.list, 1111111)
      })
    },
    handleConfirm (info) {
      this.selectItems = [info]
      console.log(this.selectItems, 'this.selectItems')
      this.$emit('changeCheckout', { data: this.selectItems })
      this.$emit('close')
    },
    getParams() {
      let params =
        this.infoParams && Object.keys(this.infoParams.length !== 0)
          ? this.infoParams
          : {}
      if (this.infoType === 'default') {
        params.pageType = 0
        return params
      } else if (
        this.infoType === 'crm_contract' ||
        this.infoType === 'crm_receivables' ||
        this.infoType === 'oa_examine'
      ) {
        params.pageType = 0
        return params
      }
    },
    changeCheckout(items) {
      if (this.radio) {
        if (items.length) {
          var element = items[0]
          this.list = this.list.map(function(item, index, array) {
            if (element.userId == item.userId) {
              item.disabled = false
            } else {
              item.disabled = true
            }
            return item
          })
        } else {
          this.list = this.list.map(function(item, index, array) {
            item.disabled = false
            return item
          })
        }
      }

      this.$emit('changeCheckout', { data: this.selectItems })
    },
    /** 取消勾选 */
    cancelCheckItem(item) {
      var removeIndex = -1
      for (let index = 0; index < this.selectItems.length; index++) {
        const element = this.selectItems[index]
        if (element.userId == item.userId) {
          removeIndex = index
        }
      }
      this.selectItems.splice(removeIndex, 1)
      if (this.radio && this.selectItems.length == 0) {
        this.list = this.list.map(function(item, index, array) {
          item.disabled = false
          return item
        })
      }
    },
    /** 标记勾选 */
    checkItems(items) {
      this.selectItems = []
      if (items.length > 0) {
        for (let bigIndex = 0; bigIndex < this.list.length; bigIndex++) {
          const item = this.list[bigIndex]

          let disabled = true
          for (let index = 0; index < items.length; index++) {
            const element = items[index]
            if (element.userId == item.userId) {
              disabled = false
              this.selectItems.push(item)
            }
          }
          if (this.radio) {
            item.disabled = disabled
          }
        }
      }
    },
    // 搜索
    inputchange(val) {
      this.list = this.list.map(function(item, index, array) {
        if (item.realname.indexOf(val) != -1) {
          item.show = true
        } else {
          item.show = false
        }
        return item
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/* 选择员工 */
.user-select {
  width: 600px;
  // background-color: #fff;
}
.search-img {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  vertical-align: middle;
  margin-right: 8px;
}
.input-container {
  display: inline-block;
  margin-bottom: 10px;
  padding-left: 20px;
}
.search-text {
  justify-items: left;
  display: inline-block;
  // width: 100px;
}
.el-input--small {
  width: 150px;
  display: inline-block;
}
.customer-search {
  display: inline-block;
  margin-left: 15px;
}
.search-list {
  padding: 5px;
  height: 248px;
  overflow: auto;
}
.colleagues-list {
  padding: 5px;
  display: block;
  margin-left: 0;
}
</style>
