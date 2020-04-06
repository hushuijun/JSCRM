<template>
  <div>
    <!-- <c-r-m-list-head title="线索管理"
                     placeholder="请输入线索名称/手机/电话"
                     :search.sync="search"
                     @on-handle="listHeadHandle"
                     @on-search="crmSearch"
                     main-title="新建线索"
                     @on-export="exportInfos"
                     :crm-type="crmType">
    </c-r-m-list-head> -->
    <el-tabs v-model="clueType" @tab-click="switchTab(clueType)" type="card">
      <el-tab-pane label="私有线索" name="0"></el-tab-pane>
      <el-tab-pane label="线索公海" name="1"></el-tab-pane>
      <el-tab-pane label="死海" name="2"></el-tab-pane>
    </el-tabs>
    <div class="input-container">
      <span>客户姓名</span>
      <el-input
        placeholder=""
        label="客户姓名" size="small" type="text" v-model="searchInfo.leads_name">
      </el-input>
    </div>
    <div class="input-container">
      <span>客户手机号</span>
      <el-input
        placeholder=""
        label="客户手机号" size="small" v-model="searchInfo.telephone">
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
      <span>线索来源</span>
      <el-input
        placeholder=""
        label="负责人" size="small" v-model="searchInfo['线索来源']">
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
    <c-r-m-list-head
      main-title="新建"
      :crm-type="crmType" :isSeas="false" @on-handle="listHeadHandle">
    </c-r-m-list-head>
    <div v-empty="!crm.leads.index"
         xs-empty-icon="nopermission"
         xs-empty-text="暂无权限"
         class="crm-container">
      <c-r-m-table-head ref="crmTableHead"
                        :crm-type="crmType"
                        :clueType="status"
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
                @header-dragend="handleHeaderDragend"
                @selection-change="handleSelectionChange">
                     <!-- @row-click="handleRowClick" -->
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
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          type="operation">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="editClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-button @click="detailClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button @click="statusClick(scope.row)" type="text" size="small">{{(clueType==0 || clueType==1) ? '无效' : '激活'}}</el-button>
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
    <clue-detail v-if="showDview"
                 :id="rowID"
                 @handle="handleHandle"
                 @hide-view="showDview=false"
                 class="d-view" :tabCurName='tabCurrentName'></clue-detail>
    <fields-set :crmType="crmType"
                @set-success="setSave"
                :dialogVisible.sync="showFieldSet"></fields-set>
    <c-r-m-create-view v-if="isCreate"
                       :crm-type="leads"
                       :action="{type: 'update', id: rowID, batchId: batchId}"
                       @save-success="editSaveSuccess"
                       @hiden-view="isCreate=false"></c-r-m-create-view>
  </div>
</template>

<script>
import ClueDetail from './ClueDetail'
import CRMCreateView from '../components/CRMCreateView'
import table from '../mixins/table'
// import table from '../mixins/detail'

export default {
  /** 客户管理 的 线索列表 */
  name: 'clueIndex',
  components: {
    ClueDetail,
    CRMCreateView
  },
  mixins: [table],
  data() {
    return {
      crmType: 'leads',
      clueType: '0',

       // leads_name 客户名称
      // mobile 客户手机号
      // owner_user_name 负责人
      // 线索来源 
      // create_time 创建时间
      searchInfo: {
        leads_name: '',
        telephone: '',
        create_time: '',
        owner_user_name: '',
        '线索来源': ''
      },
    }
  },
  computed: {},
  mounted() {},
  methods: {
    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'leadsName') {
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
</style>
