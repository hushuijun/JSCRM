<template>
  <div>
    <!-- <c-r-m-list-head title="客户管理"
                     placeholder="请输入客户名称/手机/电话"
                     :search.sync="search"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建客户"
                     @on-export="exportInfos"
                     :crm-type="crmType">
    </c-r-m-list-head> -->
    <el-tabs v-model="crmType" @tab-click="switchTab(crmType)" type="card">
      <el-tab-pane label="私有客户" name="customer"></el-tab-pane>
      <el-tab-pane label="客户公海" name="seas"></el-tab-pane>
    </el-tabs>
    <div class="input-container">
      <span>客户姓名</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.customer_name">
      </el-input>
    </div>
    <div class="input-container">
      <span>客户姓名</span>
      <el-input
        placeholder=""
        label="客户手机号" size="small" v-model="searchInfo.mobile">
      </el-input>
    </div>
    <div class="input-container">
      <span>负责人</span>
      <el-input
        placeholder=""
        label="负责人" size="small" v-model="searchInfo.owner_user_id">
      </el-input>
    </div>
    <div class="input-container">
      <span>创建时间</span>
      <!-- <el-input
        placeholder="请选择时间"
        label="创建时间" size="small" v-model="searchInfo.create_time" suffix-icon="el-icon-date" disabled="false">
      </el-input> -->
      <el-date-picker
        v-model="searchInfo.create_time"
        type="date"
        placeholder="选择日期" class="date-pick" value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <el-row class="customer-search">
      <el-button type="primary" @click="searchList(searchInfo)">搜索</el-button>
    </el-row>
    <el-row class="customer-search">
      <el-button type="primary">新建</el-button>
    </el-row>
    <div v-empty="!crm.customer.index"
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
        <el-table-column prop="businessCheck"
                         fixed
                         :resizable='false'
                         label=""
                         width="38">
          <template slot="header"
                    slot-scope="slot">
            <i class="wukong wukong-business"
               :style="{ 'color': '#2486E4'}"
               style="cursor: not-allowed; opacity: 0.5;"></i>
          </template>
          <template slot-scope="scope">
            <el-popover placement="right"
                        popper-class="no-padding-popover"
                        width="500"
                        :disabled="scope.row.businessCount == 0"
                        :offset="250"
                        trigger="click">
              <business-check :data="scope"
                              :show="scope.row.show"
                              @click="relativeBusinessClick"
                              @close="businessClose($event, scope)">
              </business-check>
              <i slot="reference"
                 @click="businessCheckClick($event, scope)"
                 class="wukong wukong-business"
                 style="color: '#2486E4'"
                 :style="{'opacity' :scope.row.businessCount > 0 ? 1 : 0}"></i>
            </el-popover>
          </template>
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
        <el-table-column v-if="CRMConfig.customerConfig == 1"
                         prop="poolDay"
                         show-overflow-tooltip
                         :resizable='false'
                         label="距进入公海天数"
                         width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.isLock == 0">{{scope.row.poolDay}}</div>
            <i v-else
               class="wukong wukong-lock customer-lock"></i>
          </template>
        </el-table-column>
        <el-table-column>
        </el-table-column>
        <el-table-column fixed="right"
                         width="36">
          <template slot="header"
                    slot-scope="slot">
            <img src="@/assets/img/t_set.png"
                 @click="handleTableSet"
                 class="table-set" />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import BusinessCheck from './components/BusinessCheck' // 相关商机
import table from '../mixins/table'

export default {
  /** 客户管理 的 客户列表 */
  name: 'customerIndex',
  components: {
    CRMAllDetail,
    BusinessCheck
  },
  mixins: [table],
  data() {
    return {
      crmType: 'customer',
      typeId: "2",
      searchInfo: {
        customer_name: '',
        mobile: '',
        create_time: '',
        realname: ''
      },
      // searchDate: ''
    }
  },
  computed: {
    ...mapGetters(['CRMConfig'])
  },
  methods: {
    relativeBusinessClick(data) {
      this.rowID = data.businessId
      this.rowType = 'business'
      this.showDview = true
    },
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'customerName' ||
        column.property === 'businessCheck'
      ) {
        return { color: '#3E84E9', cursor: 'pointer' }
      } else {
        return ''
      }
    },
    // 私有和公海tab切换
    // switchTab () {

    // },
    // 商机信息查看
    businessCheckClick(e, scope) {
      if (scope.row.businessCount == 0) {
        return
      }
      this.$set(scope.row, 'show', !scope.row.show)
      const popoverEl = e.target.parentNode
      popoverEl.__vue__.showPopper = !scope.row.show
    },
    businessClose(e, scope) {
      const popoverEl = e.parentNode
      popoverEl.__vue__.showPopper = false
      this.$set(scope.row, 'show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.customer-lock {
  color: #f15e64;
}

.el-table /deep/ tbody tr td:nth-child(2) {
  border-right-width: 0;
}

.el-table /deep/ tbody tr td:nth-child(3) {
  border-right: 1px solid #e6e6e6;
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
.date-pick {
  width: 150px;
  display: inline-block;
}
</style>
