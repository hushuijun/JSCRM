<template>
    <div>
        <el-input v-model="confirmName" style="background-color: #fff;color:#333" @focus="isShow=true"></el-input><el-button type="primary" @click="isShow=true">选择</el-button>
        <!-- 选择审核流程弹窗 -->
        <!-- <el-popover -->
            <!-- placement="top-start"
            width="400"
            v-model='isShow'> -->
        <el-dialog title="请选择审核模板" :visible.sync="isShow" :append-to-body="true" :lock-scroll="true">
            <el-table :data="gridData" border height='300'>
                <el-table-column  property="name" label="审批流程名称"></el-table-column>
                <el-table-column  property="typeText" label="流程类型"></el-table-column>
                <!-- <el-table-column width="300" property="address" label="关联对象"></el-table-column> -->
                <!-- <el-table-column width="300" property="address" label="适用范围"></el-table-column> -->
                <el-table-column
                    label="操作"
                    prop="确认"
                    >
                    <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleConfirm(scope.row)">确认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- </el-popover> -->
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
    crmType: String,
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
      console.log(this.crmType, 'crmTypecrmTypecrmTypecrmType')
      let type = ''
      if (this.crmType == 'contract') {
          type = 1
      } else if (this.crmType == 'receivables') {
          type = 2
      } else if (this.crmType == 'case') {
          type = 3
      }
      this.confirmName = this.value[0] ? this.value[0].examineName : ''
      crmContractTemplate(type).then((res) => {
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
    right: 14px;
    bottom: 5px;
}
.el-input {
    display: inline-block;
    width: 210px;
}
.el-table tr {
    text-align: center;
}
.el-dialog__body {
    padding: 0 20px 30px 20px !important;
}
</style>
