<template>
    <div>
        <el-input v-model="confirmName" style="background-color: #fff;color:#333;width: 70%"></el-input><el-button type="primary" @click="isShow=true">选择</el-button>
        <!-- 选择审核流程弹窗 -->
        <el-popover
            placement="top"
            width="400"
            v-model='isShow'>
            <el-table :data="gridData" border>
                <el-table-column width="150" property="name" label="审批流程名称"></el-table-column>
                <el-table-column width="100" property="typeText" label="流程类型"></el-table-column>
                <!-- <el-table-column width="300" property="address" label="关联对象"></el-table-column> -->
                <!-- <el-table-column width="300" property="address" label="适用范围"></el-table-column> -->
                <el-table-column
                    label="操作"
                    prop="确认"
                    width="80">
                    <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleConfirm(scope.row)">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-popover>
    </div>
</template>
<script type="text/javascript">
import stringMixin from './stringMixin'
import { crmContractTemplate } from '@/api/customermanagement/contract'
export default {
  name: 'xh-audit-template', // 新建 input
  components: {},
  mixins: [stringMixin],
//   computed: {
//     type() {
//       if (this.item && this.item.form_type == 'password') {
//         return this.item.form_type
//       } else {
//         return 'text'
//       }
//     }
//   },
  watch: {},
  data() {
    return {
        isShow: false,
        gridData: [],
        confirmName: '',
        confirmId: ''
    }
  },
  props: {
    /** 索引值 用于更新数据 */
    index: Number,
    /** 包含数据源 */
    item: Object,
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
      this.confirmName = this.value[0] ? this.value[0].examineName : ''
      crmContractTemplate().then((res) => {
          res.data.list.forEach((value) => {
              if (value.examineType == 1) {
                  value.typeText = '固定审批'
              } else if (value.examineType == 2) {
                  value.typeText = '授权审批'
              }
          })
          this.gridData = res.data.list
      })
  },
  methods: {
      handleConfirm (info) {
          this.confirmId = info.examineId
          this.confirmName = info.name
          this.$emit('value-change', {
            item: this.item,
            index: this.index,
            value: [info]
          })
          this.isShow = false
      }
  }
}
</script>
<style lang="scss" scoped>
.el-input.is-disabled .el-input__inner {
    background-color: #fff!important;
    color: #333!important;
}
.el-button--primary {
    display: inline-block;
    position: absolute;
    right: -60px;
    bottom: 5px;
}
.el-input {
    display: inline-block;
}
</style>
