<template>
  <slide-view v-empty="!canShowDetail"
              xs-empty-icon="nopermission"
              xs-empty-text="暂无权限"
              :listenerIDs="listenerIDs"
              :noListenerIDs="noListenerIDs"
              :noListenerClass="noListenerClass"
              @side-close="hideView"
              :body-style="{padding: 0, height: '100%'}">
    <flexbox v-if="canShowDetail"
             v-loading="loading"
             direction="column"
             align="stretch"
             class="d-container">
      <!-- <c-r-m-detail-head crmType="leads"
                         @handle="detailHeadHandle"
                         @close="hideView"
                         :detail="detailData"
                         :headDetails="headDetails"
                         :id="id">
      </c-r-m-detail-head> -->
      <c-r-m-detail-head crmType="contract"
                         @handle="detailHeadHandle"
                         @close="hideView"
                         :detail="detailData"
                         :headDetails="headDetails"
                         :id="id">
      </c-r-m-detail-head>
      <div class="examine-info">
        <examine-info :id="id"
                      class="examine-info-border"
                      examineType="crm_contract"
                      @on-handle='checkSave'
                      :recordId="detailData.examineRecordId"
                      :ownerUserId="detailData.ownerUserId">
        </examine-info>
      </div>
      <!-- <div class="close-detail el-icon-close" @click="closeDetail"></div> -->
      <div class="tabs">
        <el-tabs v-model="tabCurrentName"
                 @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabnames"
                       :key="index"
                       :label="item.label"
                       :name="item.name">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="t-loading-content"
           id="follow-log-content">
        <keep-alive>
          <component v-bind:is="tabName"
                     crmType="case"
                     :detail="detailData"
                     :id="id" :contractId="contractId"></component>
        </keep-alive>
      </div>
    </flexbox>
    <c-r-m-create-view v-if="isCreate"
                       crm-type="leads"
                       :action="{type: 'update', id: this.id, batchId: detailData.batchId}"
                       @save-success="editSaveSuccess"
                       @hiden-view="isCreate=false"></c-r-m-create-view>
  </slide-view>
</template>

<script>
import { crmCaseRead } from '@/api/customermanagement/case'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CaseFollow from './components/CaseFollow' // 跟进记录
import CRMBaseInfo from '../components/CRMBaseInfo' // 案件基本信息
import RelativeFiles from '../components/RelativeFiles' //相关附件
import RelativeHandle from '../components/RelativeHandle' //相关操作
import CaseProcess from './components/CaseProcess' // 审核流程
import RelativeReturnMoney from '../components/RelativeReturnMoney' //相关回款
import CaseInvoice from './components/CaseInvoice' //相关回款
import CaseCost from './components/CaseCost' //相关回款

import CRMCreateView from '../components/CRMCreateView' // 新建页面
import ExamineInfo from '@/components/Examine/ExamineInfo'


import { getDateFromTimestamp } from '@/utils'
import moment from 'moment'
import detail from '../mixins/detail'

export default {
  /** 线索管理 的 线索详情 */
  name: 'clue-detail',
  components: {
    SlideView,
    CRMDetailHead,
    CaseFollow,
    CRMBaseInfo,
    RelativeFiles,
    RelativeHandle,
    CRMCreateView,
    RelativeReturnMoney,
    CaseProcess,
    CaseInvoice,
    CaseCost,
    ExamineInfo
  },
  mixins: [detail],
  props: {
    // 详情信息id
    id: [String, Number],
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    },
    tabCurName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false, // 展示加载loading
      crmType: 'leads',
      detailData: {}, // read 详情
      headDetails: [
        { title: '案件名称', value: '' },
        { title: '案件编号', value: '' },
        { title: '客户名称', value: '' },
        { title: '负责人', value: '' },
        { title: '创建时间', value: '' }
      ],
      tabnames: [
        { label: '基本信息', name: 'basicinfo' },
        { label: '跟进记录', name: 'followlog' },
        { label: '审核流程', name: 'caseprocess' },
        { label: '相关附件', name: 'file' },
        { label: '回款', name: 'returnedmoney' },
        { label: '发票', name: 'invoice' },
        { label: '费用', name: 'cost' },
        // { label: '附件', name: 'file' },
        // { label: '操作记录', name: 'operationlog' }
      ],
      tabCurrentName: '',
      isCreate: false, // 编辑操作
      contractId: ''
    }
  },
  created() {
    this.tabCurrentName = this.tabCurName ? this.tabCurName : 'basicinfo'
  },
  computed: {
    // tabCurrentName () {
    //   return this.tabCurName ? this.tabCurName : 'basicinfo' 
    // },
    tabName() {
      if (this.tabCurrentName == 'followlog') {
        return 'case-follow'
      } else if (this.tabCurrentName == 'basicinfo') {
        return 'c-r-m-base-info'
      } else if (this.tabCurrentName == 'file') {
        return 'relative-files'
      } else if (this.tabCurrentName == 'caseprocess') {
        return 'case-process'
      } else if (this.tabCurrentName == 'returnedmoney') {
        return 'relative-return-money'
      } else if (this.tabCurrentName == 'invoice') {
        return 'case-invoice'
      } else if (this.tabCurrentName == 'cost') {
        return 'case-cost'
      }
      return ''
    }
  },
  mounted() {},
  methods: {
    closeDetail () {
      this.$emit("hide-view")
    },
    getDetial() {
      this.loading = true
      crmCaseRead({
        caseId: this.id
      })
        .then(res => {
          this.detailData = res.data
          this.contractId = res.data.contractId
          this.headDetails[0].value = res.data.name
          this.headDetails[1].value = res.data.num
          this.headDetails[2].value = res.data.customerName
          // 负责人
          this.headDetails[3].value = res.data.ownerUserName
          this.headDetails[4].value = res.data.createTime
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    //** 点击关闭按钮隐藏视图 */
    hideView() {
      this.$emit('hide-view')
    },
    checkSave() {
      this.$emit('checkSave')
    },
    //** tab标签点击 */
    handleClick(tab, event) {},
    editSaveSuccess() {
      this.$emit('handle', { type: 'save-success' })
      this.getDetial()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/crmdetail.scss';
.el-icon-close:before {
  font-size: 30px;
  color: #666;
  position: fixed;
  right: 24px;
  top: 65px;
  z-index: 99;
}
</style>
