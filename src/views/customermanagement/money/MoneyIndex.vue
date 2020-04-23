<template>
  <div>
    <div class="main-title">回款管理</div>
    <div class="input-container">
      <span>合同编号</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.contract_num">
      </el-input>
    </div>
    <div class="input-container">
      <span>客户名称</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.customer_name ">
      </el-input>
    </div>
    <div class="input-container">
      <span>审核状态</span>
      <el-select v-model="searchInfo.check_status" placeholder="请选择">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="dateTime">
      <span>回款日期</span>
      <div class="block">
        <el-date-picker
          v-model="searchInfo.return_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>
    <div class="input-container">
      <span class="last-name">负责人</span>
      <el-input
        placeholder=""
        label="负责人" size="small" type="text" v-model="searchInfo.owner_user_name">
      </el-input>
    </div>
    <el-row class="customer-search">
      <el-button type="primary" @click="searchList(searchInfo)" icon="el-icon-search">搜索</el-button>
    </el-row>
    <c-r-m-list-head title="回款管理"
                     placeholder="请输入回款编号"
                     :search.sync="search"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建回款"
                     :crm-type="crmType">
    </c-r-m-list-head>
    <div v-empty="!crm.receivables.index"
         xs-empty-icon="nopermission"
         xs-empty-text="暂无权限"
         class="crm-container">
      <c-r-m-table-head ref="crmTableHead"
                        :crm-type="crmType"
                        @filter="handleFilter"
                        @handle="handleHandle"
                        @scene="handleScene"></c-r-m-table-head>
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
          min-width="200"
          type="operation">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="editClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-button @click="submitCheck(scope.row)" type="text" size="small" v-if="scope.row.checkStatus == 0 || scope.row.checkStatus == 4 || scope.row.checkStatus == null">提交审核</el-button>
            <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button>
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
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail :visible.sync="showDview"
                      :crmType="rowType"
                      :id="rowID"
                      @handle="handleHandle"
                      class="d-view">
    </c-r-m-all-detail>
    <fields-set :crmType="crmType"
                @set-success="setSave"
                :dialogVisible.sync="showFieldSet"></fields-set>
    <c-r-m-create-view v-if="isCreate"
        crm-type="receivables"
        :action="{type: 'update', id: rowID, batchId: batchId}"
        @save-success="editSaveSuccess"
        @hiden-view="isCreate=false"></c-r-m-create-view>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import CRMCreateView from '../components/CRMCreateView'
import table from '../mixins/table'

export default {
  /** 客户管理 的 回款列表 */
  name: 'receivablesIndex',
  components: {
    CRMAllDetail,
    CRMCreateView
  },
  mixins: [table],
  data() {
    return {
      crmType: 'receivables',
      searchInfo: {
        contract_num: '',
        customer_name: '',
        check_status: '',
        return_time: '',
        owner_user_name: ''
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
  computed: {},
  mounted() {},
  methods: {
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'number' ||
        column.property === 'customerName' ||
        column.property === 'contractNum'
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
.main-title {
  font-size: 20px;
  padding: 20px 0;
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
.customer-search {
  display: inline-block;  
}
.el-select {
  width: 150px;
}
.date-pick {
  width: 150px;
  display: inline-block;
}
.dateTime {
  display: inline-block;
  .block {
    display: inline-block;
  }
}
.last-name {
  width: 56px;
  display: inline-block;
}
</style>
