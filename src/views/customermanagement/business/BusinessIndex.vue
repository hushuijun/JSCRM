<template>
  <div>
    <!-- <c-r-m-list-head title="商机管理"
                     placeholder="请输入商机名称"
                     :search.sync="search"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建商机"
                     :crm-type="crmType">
    </c-r-m-list-head> -->
    <div class="main-title">商机管理</div>
    <div class="input-container">
      <span>客户姓名</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.customer_name">
      </el-input>
    </div>
    <div class="input-container">
      <span>商机名称</span>
      <el-input
        placeholder=""
        label="商机名称" size="small" v-model="searchInfo.business_name">
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
      <span>
        商机状态
      </span>
      <el-select v-model="searchInfo['商机状态']" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-input
        placeholder=""
        label="商机状态" size="small" v-model="searchInfo['商机状态']">
      </el-input> -->
    </div>
    <el-row class="customer-search">
      <el-button type="primary" @click="searchList(searchInfo)" icon="el-icon-search">搜索</el-button>
    </el-row>
    <c-r-m-list-head
      main-title="新建商机"
      :crm-type="crmType" :isSeas="false" @on-handle="listHeadHandle">
    </c-r-m-list-head>
    <div v-empty="!crm.business.index"
         xs-empty-icon="nopermission"
         xs-empty-text="暂无权限"
         class="crm-container">
      <c-r-m-table-head ref="crmTableHead"
                        :crm-type="crmType"
                        @filter="handleFilter"
                        @handle="handleHandle"
                        @scene="handleScene" @handleRecordsClick="handleRecordsClick"></c-r-m-table-head>
      <!-- @row-click="handleRowClick" -->
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
          min-width="150"
          type="operation">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="editClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
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
                      class="d-view" :tabCurrentName='tabCurrentName'>
    </c-r-m-all-detail>
    <fields-set :crmType="crmType"
                @set-success="setSave"
                :dialogVisible.sync="showFieldSet"></fields-set>
    <c-r-m-create-view v-if="isCreate"
        :crm-type="crmType"
        :action="{type: 'update', id: rowID, batchId: batchId}"
        @save-success="editSaveSuccess"
        @hiden-view="isCreate=false"></c-r-m-create-view>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import table from '../mixins/table'

export default {
  /** 客户管理 的 商机列表 */
  name: 'businessIndex',
  components: {
    CRMAllDetail
  },
  mixins: [table],
  data() {
    return {
      crmType: 'business',
      searchInfo: {
        customer_name: '',
        business_name: '',
        owner_user_name: '',
        '商机状态': ''
      },
      options: [
        {
          value: '',
          label: '全部'
        }, 
        {
          value: '初步洽谈',
          label: '初步洽谈'
        }, {
          value: '深入沟通',
          label: '深入沟通'
        }, {
          value: '流失商机',
          label: '流失商机'
        },
         {
          value: '成交商机',
          label: '成交商机'
        }],
    }
  },
  computed: {},
  mounted() {},
  methods: {
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'businessName' || column.property === 'customerName') {
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
