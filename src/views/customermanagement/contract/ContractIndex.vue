<template>
  <div>
    <div class="main-title">合同管理</div>
    <div class="input-container">
      <span>客户姓名</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.customer_name">
      </el-input>
    </div>
    <div class="input-container">
      <span>合同名称</span>
      <el-input
        placeholder=""
        label="合同名称" size="small" v-model="searchInfo.name">
      </el-input>
    </div>
    <div class="input-container">
      <span>负责人</span>
      <el-input
        placeholder=""
        label="负责人" size="small" v-model="searchInfo.owner_user_name">
      </el-input>
    </div>
    <div class="input-container">
      <span>合同状态</span>
      <el-select v-model="searchInfo.check_status" placeholder="请选择">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="input-container">
      <span>客户签署人</span>
      <el-input
        placeholder=""
        label="客户签署人" size="small" v-model="searchInfo['客户签约人']">
      </el-input>
    </div>
    <div class="input-container">
      <span>公司签署人</span>
      <el-input
        placeholder=""
        label="公司签署人" size="small" v-model="searchInfo.company_user_name">
      </el-input>
    </div>
    <el-row class="customer-search">
      <el-button type="primary" @click="searchList(searchInfo)" icon="el-icon-search">搜索</el-button>
    </el-row>
    <c-r-m-list-head title="合同管理"
                     placeholder="请输入合同名称"
                     :search.sync="search"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建合同"
                     :crm-type="crmType">
    </c-r-m-list-head>
    <div v-empty="!crm.contract.index"
         xs-empty-icon="nopermission"
         xs-empty-text="暂无权限"
         class="crm-container">
      <c-r-m-table-head ref="crmTableHead"
                        :crm-type="crmType"
                        @filter="handleFilter"
                        @handle="handleHandle"
                        @scene="handleScene" @handleRecordsClick="handleRecordsClick"></c-r-m-table-head>
      <el-table class="n-table--border"
                id="crm-table"
                v-loading="loading"
                :data="list"
                :height="tableHeight"
                stripe
                border
                highlight-current-row
                style="width: 100%"
                :cell-style="cellStyle"
                @row-click="handleRowClick"
                @header-dragend="handleHeaderDragend"
                @selection-change="handleSelectionChange">
        <el-table-column show-overflow-tooltip
                         type="selection"
                         align="center"
                         width="55">
        </el-table-column>
        <el-table-column v-for="(item, index) in fieldList"
                         :key="index"
                         show-overflow-tooltip
                         :fixed="index==0"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width"
                         :formatter="fieldFormatter">
          <template slot="header"
                    slot-scope="scope">
            <div class="table-head-name">{{scope.column.label}}</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="checkStatus"
                         label="状态"
                         :resizable="false"
                         width="100"
                         align="center"
                         fixed="right">
          <template slot="header"
                    slot-scope="scope">
            <div class="table-head-name">{{scope.column.label}}</div>
          </template>
          <template slot-scope="scope">
            <div class="status_button"
                 :style="getStatusStyle(scope.row.checkStatus)">
              {{getStatusName(scope.row.checkStatus)}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column>
        </el-table-column> -->
        <!-- <el-table-column fixed="right"
                         width="36">
          <template slot="header"
                    slot-scope="slot">
            <img src="@/assets/img/t_set.png"
                 @click="handleTableSet"
                 class="table-set" />
          </template>
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作"
          min-width="180"
          type="operation">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="editClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="submitCheck(scope.row)" type="text" size="small" v-if="scope.row.checkStatus == 0 || scope.row.checkStatus == 4 || scope.row.checkStatus == null">提交审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-contianer">
        <el-pagination class="p-bar"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="pageSizes"
                       :page-size.sync="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
        <!-- <span class="money-bar">合同总金额：{{moneyPageData.contractMoney || 0}} / 已回款金额：{{moneyPageData.receivedMoney || 0}}</span> -->
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail :visible.sync="showDview"
                      :crmType="rowType"
                      :id="rowID"
                      @handle="handleHandle"
                      class="d-view"
                      :tabCurrentName='tabCurrentName'>
    </c-r-m-all-detail>
    <c-r-m-create-view v-if="isCreate"
                       crm-type="contract"
                       :action="{type: 'update', id: rowID, batchId: batchId}"
                       @save-success="editSaveSuccess"
                       @hiden-view="isCreate=false"></c-r-m-create-view>
    <fields-set :crmType="crmType"
                @set-success="setSave"
                :dialogVisible.sync="showFieldSet"></fields-set>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import table from '../mixins/table'

export default {
  /** 客户管理 的 合同列表 */
  name: 'contractIndex',
  components: {
    CRMAllDetail
  },
  mixins: [table],
  data() {
    return {
      crmType: 'contract',
      moneyData: null, //合同列表金额
      searchInfo: {
        customer_name: "",
        name: "",
        owner_user_name: "",
        '客户签约人': "",
        company_user_name: "",
        check_status: ""
      },
      statusList: [
        {label: '全部', value: ''},
        {label: '未提交', value: '0'},
        {label: '审核中', value: '1'},
        {label: '通过', value: '2'},
        {label: '拒绝', value: '3'},
        {label: '撤回', value: '4'}
      ]
    }
  },
  computed: {
    moneyPageData() {
      // 未勾选展示合同总金额信息
      if (this.selectionList.length == 0 && this.moneyData) {
        return this.moneyData
      } else {
        let contractMoney = 0.0
        let receivedMoney = 0.0
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          // 2 审核通过的合同
          if (element.checkStatus == 2) {
            contractMoney += parseFloat(element.money)
            receivedMoney += parseFloat(element.receivedMoney)
          }
        }
        return {
          contractMoney: contractMoney.toFixed(2),
          receivedMoney: receivedMoney.toFixed(2)
        }
      }
    }
  },
  mounted() {},
  methods: {
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'num' ||
        column.property === 'customerName' ||
        column.property === 'businessName' ||
        column.property === 'contactsName'
      ) {
        return { color: '#3E84E9', cursor: 'pointer' }
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.crm-container {
  position: relative;
  margin-top: 36px;
}
.main-title {
  height: 60px;
    font-size: 18px;
    padding: 0 20px;
    line-height: 60px;
    font-weight: 700;
}
.money-bar {
  color: #99a9bf;
  line-height: 44px !important;
  position: absolute;
  left: 20px;
  top: 0;
}
.input-container {
  width: 246px;
  display: inline-block;
  margin-bottom: 20px;
  span {
    width: 72px;
    display: inline-block;
  }
}
.el-input--small{
  width: 150px;
  display: inline-block;
}
.customer-search {
  display: inline-block;
  
}
.date-pick {
  width: 150px;
  display: inline-block;
}
.el-button--small {
  margin-left: 0;
}
.el-select {
  width: 150px;
}
.el-table__header .table-head-name {
  font-weight: 700;
}
.p-contianer {
  .p-bar {
    /deep/ .el-pagination__total {
      font-size: 15px !important;
    }
  }
  /deep/ .el-input__inner {
    font-size: 15px !important;
  }
  /deep/ .el-pager {
    /deep/ .number {
      font-size: 16px !important;
    }
  }
  /deep/ .el-pagination__jump {
    font-size: 15px !important;
   /deep/ .el-pagination__editor {
      font-size: 18px !important;
    }
  }
}
</style>
