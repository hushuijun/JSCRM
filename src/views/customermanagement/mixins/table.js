/** crm自定义列表 公共逻辑 */
import {
  mapGetters
} from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CRMListHead from '../components/CRMListHead'
import CRMTableHead from '../components/CRMTableHead'
import FieldsSet from '../components/fieldsManager/FieldsSet'
import CRMCreateView from '../components/CRMCreateView'
import {
  filedGetTableField,
  crmFieldColumnWidth
} from '@/api/customermanagement/common'
import {
  crmCustomerIndex,
  crmCustomerPool,
  crmCustomerExcelAllExport,
  crmCustomerPoolExcelAllExport,
  crmCustomerDelete
} from '@/api/customermanagement/customer'
import {
  crmLeadsIndex,
  crmLeadsExcelAllExport,
  crmLeadsDelete,
  crmLeadsStatus
} from '@/api/customermanagement/clue'
import {
  crmContactsIndex,
  crmContactsExcelAllExport,
  // crmContractDelete
} from '@/api/customermanagement/contacts'
import {
  crmBusinessIndex,
  crmBusinessDelete
} from '@/api/customermanagement/business'
import {
  crmContractIndex,
  crmContractDelete,
  submitContractCheck
} from '@/api/customermanagement/contract'
import {
  crmProductIndex,
  crmProductExcelAllExport
} from '@/api/customermanagement/product'
import {
  crmCaseIndex,
  crmCaseDelete,
  submitCaseCheck
} from '@/api/customermanagement/case'
import {
  crmReceivablesIndex,
  submitReceivablesCheck,
  crmReceivablesDelete
} from '@/api/customermanagement/money'
export default {
  components: {
    CRMListHead,
    CRMTableHead,
    FieldsSet,
    CRMCreateView
  },
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 240, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,
      search: '', // 搜索内容
      /** 控制详情展示 */
      rowID: '', // 行信息
      rowType: '', //详情类型
      showDview: false,
      batchId: '',
      /** 高级筛选 */
      filterObj: {}, // 筛选确定数据
      sceneId: "", // 场景筛选ID
      sceneName: '', // 场景名字
      /** 列表展示字段管理 */
      showFieldSet: false,
      /** 勾选行 */
      selectionList: [], // 勾选数据 用于全局导出
      clickRow: {},
      isEdit: false,
      operationType: {},
      customerId: '',
      isSeas: false,
      status: '0',
      isCreate: false,
      followId: '',
      tabCurrentName: '',
      selectedStatus: '',
      isCreateBusiness: false,
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {} },
      caseStatus: 2,
    }
  },

  computed: {
    ...mapGetters(['crm'])
  },

  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
    // document.getElementById('crm-table').addEventListener('click', e => {
    //   e.stopPropagation()
    // })
    if (this.isSeas && this.crm.pool.index) {
      this.getFieldList()
    } else if (this.crm[this.crmType].index) {
      this.loading = true
    }
  },

  methods: {
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var crmIndexRequest = this.getIndexRequest()
      var params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        type: this.isSeas ? 8 : crmTypeModel[this.crmType] // 8是公海
        // type: this.crmType ? crmTypeModel[this.crmType]: 8
      }
      if (this.crmType == 'leads') {
        params.status = parseInt(this.status)
      }
      if (this.caseStatus && this.crmType == 'case') {
        params.status = this.caseStatus
      }
      // if (this.sceneId) {
      //   params.sceneId = parseInt(this.sceneId)
      // }
      // params.sceneId = parseInt(sceneId)
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj
      }
      crmIndexRequest(params)
        .then(res => {
          if (this.crmType === 'customer') {
            this.list = res.data.list.map(element => {
              element.show = false // 控制列表商机展示
              return element
            })
          } else {
            if (this.crmType === 'contract') {
              // 合同列表展示金额信息
              this.moneyData = res.data.money
            }
            this.list = res.data.list
          }

          this.total = res.data.totalRow

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 获取列表请求 */
    getIndexRequest() {
      if (this.crmType === 'leads') {
        return crmLeadsIndex
      } else if (this.crmType === 'customer') {
        if (this.isSeas) {
          return crmCustomerPool
        } else {
          return crmCustomerIndex
        }
      } else if (this.crmType === 'contacts') {
        return crmContactsIndex
      } else if (this.crmType === 'business') {
        return crmBusinessIndex
      } else if (this.crmType === 'contract') {
        return crmContractIndex
      } else if (this.crmType === 'product') {
        return crmProductIndex
      } else if (this.crmType === 'receivables') {
        return crmReceivablesIndex
      } else if (this.crmType === 'seas') {
        return crmCustomerPool
      } else if (this.crmType === 'case') {
        return crmCaseIndex
      }
    },
    /** 获取字段 */
    getFieldList() {
      if (this.fieldList.length == 0) {
        this.loading = true
        filedGetTableField({
          label: this.isSeas ? 8 : crmTypeModel[this.crmType] // 8 是公海
        })
          .then(res => {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index]

              var width = 0
              if (!element.width) {
                if (element.name && element.name.length <= 6) {
                  width = element.name.length * 15 + 45
                } else {
                  width = 140
                }
              } else {
                width = element.width
              }

              this.fieldList.push({
                prop: element.fieldName,
                label: element.name,
                width: width
              })
            }

            // 获取好字段开始请求数据
            this.getList()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        // 获取好字段开始请求数据
        this.getList()
      }
    },
    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      return row[column.property] || '--'
    },
    /** */
    /** */
    /** 搜索操作 */
    crmSearch(value) {
      this.search = value
      if (this.fieldList.length) {
        this.getList()
      }
    },
    //点击搜索
    searchList (info) {
      let params = {}
      if (this.crmType === 'customer') {
        info.customer_name ? params.customer_name = {"condition": "contains", "value": info.customer_name,"formType": "text","name": "customer_name"} : ''
        info.mobile ? params.telephone = {"condition": "contains", "value": info.mobile,"formType": "text","name": "telephone"} : ''
        info.realname ? params.owner_user_name = {"condition": "contains", "value": info.realname,"formType": "text","name": "owner_user_name"} : ''
        info.create_time ? params.create_time = {"start": info.create_time[0] + ' 00:00:00',"end": info.create_time[1] + ' 23:59:59',"formType": "datetime","name": "create_time"} : ''
      } else if (this.crmType === 'leads') {
        info.telephone ? params.telephone = {"condition": "contains", "value": info.telephone,"formType": "text","name": "telephone"} : ''
        info.leads_name ? params.leads_name = {"condition": "contains", "value": info.leads_name,"formType": "text","name": "leads_name"} : ''
        info.owner_user_name ? params.owner_user_name = {"condition": "contains", "value": info.owner_user_name,"formType": "text","name": "owner_user_name"} : ''
        info['线索来源'] ? params['线索来源'] = {"condition": "is", "value": info['线索来源'],"formType": "text","name": "线索来源"} : ''
        info.create_time ? params.create_time = {"start": info.create_time[0] + ' 00:00:00',"end": info.create_time[1] + ' 23:59:59',"formType": "datetime","name": "create_time"} : ''
      } else if (this.crmType === 'business') {
        info.customer_name ? params.customer_name = {"condition": "contains", "value": info.customer_name,"formType": "text","name": "customer_name"} : ''
        info.business_name ? params.business_name = {"condition": "contains", "value": info.business_name,"formType": "text","name": "business_name"} : ''
        info.owner_user_name ? params.owner_user_name = {"condition": "contains", "value": info.owner_user_name,"formType": "text","name": "owner_user_name"} : ''
        info['商机状态'] ? params['商机状态'] = {"condition": "is", "value": info['商机状态'],"formType": "text","name": "商机状态"} : ''
      } else if (this.crmType === 'contract') {
        info.customer_name ? params.customer_name = {"condition": "contains", "value": info.customer_name,"formType": "text","name": "customer_name"} : ''
        info.name ? params.name = {"condition": "contains", "value": info.name,"formType": "text","name": "name"} : ''
        info.owner_user_name ? params.owner_user_name = {"condition": "contains", "value": info.owner_user_name,"formType": "text","name": "owner_user_name"} : ''
        info['客户签约人'] ? params['客户签约人'] = {"condition": "contains", "value": info['客户签约人'],"formType": "text","name": "客户签约人"} : ''
        info.company_user_name ? params.company_user_name = {"condition": "contains", "value": info.company_user_name,"formType": "text","name": "company_user_name"} : ''
        info.check_status ||  info.check_status == 0 ? params.check_status = {"condition": "is", "value": info.check_status,"formType": "checkStatus","name": "check_status"} : ''
      } else if (this.crmType === 'case') {
        info.name ? params.name  = {"condition": "contains", "value": info.name ,"formType": "text","name": "name"} : ''
        info.num ? params.num = {"condition": "contains", "value": info.num,"formType": "text","name": "num"} : ''
        info.contract_num ? params.contract_num = {"condition": "contains", "value": info.contract_num,"formType": "text","name": "contract_num"} : ''
        info.customer_name ? params.customer_name = {"condition": "contains", "value": info.customer_name,"formType": "text","name": "customer_name"} : ''
        info.owner_user_name ? params.owner_user_name = {"condition": "contains", "value": info.owner_user_name,"formType": "text","name": "owner_user_name"} : ''
        info.status ? this.caseStatus = parseInt(info.status) : ''
        // info.checkStatus ? this.checkStatus = info.checkStatus : ''
        info.check_status || info.check_status == 0 ? params.check_status = {"condition": "is", "value": info.check_status,"formType": "checkStatus","name": "check_status"} : ''
      } else if (this.crmType === 'receivables') {
        info.contract_num ? params.contract_num  = {"condition": "contains", "value": info.contract_num,"formType": "text","name": "contract_num"} : ''
        info.customer_name ? params.customer_name = {"condition": "contains", "value": info.customer_name,"formType": "text","name": "customer_name"} : ''
        info.owner_user_name ? params.owner_user_name = {"condition": "contains", "value": info.owner_user_name,"formType": "text","name": "owner_user_name"} : ''
        info.check_status || info.check_status == 0 ? params.check_status = {"condition": "is", "value": info.check_status,"formType": "checkStatus","name": "check_status"} : ''
        info.return_time ? params.return_time = {"start": info.return_time[0] + ' 00:00:00',"end": info.return_time[1] + ' 23:59:59',"formType": "datetime","name": "return_time"} : ''
      }
      this.filterObj = params
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240
      this.tableHeight = offsetHei - removeHeight
      this.currentPage = 1
      this.getList()
    },
    /** 列表操作 */
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
    //   if (column.type === 'selection') {
    //     return // 多选布局不能点击
    //   }
    //   if (this.crmType === 'leads') {
    //     if (column.property === 'leadsName' || !column.property) {
    //       this.rowID = row.leadsId
    //       this.showDview = true
    //     } else {
    //       this.showDview = false
    //     }
    //   } else if (this.crmType === 'customer' || this.crmType === 'seas') {
    //     if (column.property === 'businessCheck' && row.businessCount > 0) {
    //       return // 列表查看商机不展示详情
    //     }
    //     if (column.property === 'customerName' || !column.property) {
    //       this.rowID = row.customerId
    //       this.rowType = 'customer'
    //       this.showDview = true
    //     } else {
    //       this.showDview = false
    //     }
    //   } else if (this.crmType === 'contacts') {
    //     if (column.property === 'customerName') {
    //       this.rowID = row.customerId
    //       this.rowType = 'customer'
    //       this.showDview = true
    //     } else if (column.property === 'name') {
    //       this.rowID = row.contactsId
    //       this.rowType = 'contacts'
    //       this.showDview = true
    //     } else {
    //       this.showDview = false
    //     }
    //   } else if (this.crmType === 'business') {
    //     if (column.property === 'customerName') {
    //       this.rowID = row.customerId
    //       this.rowType = 'customer'
    //       this.showDview = true
    //     } else if (column.property === 'businessName') {
    //       this.rowID = row.businessId
    //       this.rowType = 'business'
    //       this.showDview = true
    //     } else {
    //       this.showDview = false
    //     }
      // } else 
      // if (this.crmType === 'contract') {
      //   if (column.property === 'customerName') {
      //     this.rowID = row.customerId
      //     this.rowType = 'customer'
      //     this.showDview = true
      //   } else if (column.property === 'businessName') {
      //     this.rowID = row.businessId
      //     this.rowType = 'business'
      //     this.showDview = true
      //   } else if (column.property === 'contactsName') {
      //     this.rowID = row.contactsId
      //     this.rowType = 'contacts'
      //     this.showDview = true
      //   } else if (column.property === 'num') {
      //     this.rowID = row.contractId
      //     this.rowType = 'contract'
      //     this.showDview = true
      //   } else {
      //     this.showDview = false
      //   }
    //   } else if (this.crmType === 'product') {
    //     if (column.property === 'name') {
    //       this.rowID = row.productId
    //       this.showDview = true
    //     } else {
    //       this.showDview = false
    //     }
      // } else 
      // if (this.crmType === 'receivables') {
      //   if (column.property === 'customerName') {
      //     this.rowID = row.customerId
      //     this.rowType = 'customer'
      //     this.showDview = true
      //   } else if (column.property === 'contractNum') {
      //     this.rowID = row.contractId
      //     this.rowType = 'contract'
      //     this.showDview = true
      //   } else if (column.property === 'number') {
      //     this.rowID = row.receivablesId
      //     this.rowType = 'receivables'
      //     this.showDview = true
      //   } else {
      //     this.showDview = false
      //   }
      // }
    },
    deleteClick (info) {
      this.$confirm('确定要删除这条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.confirmHandle(info)
      })
    },
    //确认删除
    confirmHandle (info){
      let request = {
        leads: crmLeadsDelete,
        customer: crmCustomerDelete,
        // contacts: crmContactsDelete,
        business: crmBusinessDelete,
        contract: crmContractDelete,
        case: crmCaseDelete,
        receivables: crmReceivablesDelete
      }[this.crmType]
      request({
        [this.crmType + 'Ids']: info[this.crmType+'Id']
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getFieldList()
          this.$emit('handle', { type: type })
        })
        .catch(() => {})
    },
    //编辑
    editClick (data, type) {
      data.type = type
      this.rowID = data[this.crmType+'Id']
      this.batchId = data['batchId']
      // detailHeadHandle(data) {
      if (type === 'edit') {
        this.isCreate = true
      } else if (type === 'delete') {
        this.hideView()
      }
      this.$emit('handle', data)
      // }
    },
    // 置为无效
    statusClick (data) {
      this.rowID = data[this.crmType+'Id']
      crmLeadsStatus({
        status: this.status == 0 || this.status == 1 ? 0 : 1,
        leadsIds: this.rowID
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '成功'
        })
        this.getFieldList()
      })
    },
    submitCheck (data) {
      var crmCaseRequest = this.getCheckRequest()
      let param = ''
      if (this.crmType == 'contract') {
        param = data.contractId
      } else if (this.crmType == 'case') {
        param = data.caseId
      } else if (this.crmType == 'receivables') {
        param = data.receivablesId
      }
      crmCaseRequest(param).then((res) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        this.getcrmMessagNum()
        this.getFieldList()
      }).catch((e) => {})
    },
    //刷新消息数
    getcrmMessagNum() {
      this.$store
        .dispatch('GetMessageNum')
        .then(res => {})
        .catch(() => {})
    },
    /** 获取审核接口 */
    getCheckRequest() {
      if (this.crmType === 'contract') {
        return submitContractCheck
      } else if (this.crmType === 'case') {
        return submitCaseCheck
      } else if (this.crmType === 'receivables') {
        return submitReceivablesCheck
      }
    },
    // 保存成功
    editSaveSuccess () {
      this.getFieldList()
    },
    handleRecordsClick (data) {
      if (this.selectionList.length > 1) {
        this.$message({
          type: 'warning',
          message: '只能选择一项'
        })
        return false
      }
      this.rowID = this.followId
      if (this.crmType === 'customer') {
        this.rowType = 'customer'
      } else if (this.crmType === 'business') {
        this.rowType = 'business'
      } else if (this.crmType === 'contract') {
        this.rowType = 'contract'
      }
      if (data.type == 'business') {
        this.tabCurrentName = 'business'
      } else if (data.type == 'follow_records'){
        this.tabCurrentName = 'followlog'
      } else if (data.type == 'cash_plan') {
        this.tabCurrentName = 'returnedmoney'
      }
      this.showDview = true
    },
    //查看详情
    detailClick (data) {
      this.rowID = data[this.crmType+'Id']
      this.tabCurrentName = ''
      if (this.crmType === 'customer') {
        this.rowType = 'customer'
      } else if (this.crmType === 'business') {
        this.rowType = 'business'
      } else if (this.crmType === 'contract') {
        // this.rowID = row.customerId
        this.rowType = 'contract'
      } else if (this.crmType === 'case') {
        // this.rowID = row.customerId
        this.rowType = 'case'
      } else if (this.crmType === 'receivables') {
        // this.rowID = row.customerId
        this.rowType = 'receivables'
      }
      // this.rowID = row.leadsId
      this.showDview = true
      // this.handleRowClick()
    },
    //跟进
    caseFollowLog (data) {
      this.rowID = data[this.crmType+'Id']
      if (this.crmType === 'case') {
        this.rowType = 'case'
      }
      this.tabCurrentName = 'followlog'
      this.showDview = true
    },

    /**
     * 导出 线索 客户 联系人 产品
     * @param {*} data 
     */
    // 导出操作
    exportInfos() {
      var params = {
        search: this.search
      }
      if (this.sceneId) {
        params.sceneId = this.sceneId
      }
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj
      }
      let request
      // 公海的请求
      if (this.isSeas) {
        request = crmCustomerPoolExcelAllExport
      } else {
        request = {
          customer: crmCustomerExcelAllExport,
          leads: crmLeadsExcelAllExport,
          contacts: crmContactsExcelAllExport,
          product: crmProductExcelAllExport
        }[this.crmType]
      }

      request(params)
        .then(res => {
          var blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) //创建下载的链接
          downloadElement.href = href
          downloadElement.download =
            decodeURI(
              res.headers['content-disposition'].split('filename=')[1]
            ) || '' //下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() //点击下载
          document.body.removeChild(downloadElement) //下载完成移除元素
          window.URL.revokeObjectURL(href) //释放掉blob对象
        })
        .catch(() => { })
    },
    /** 筛选操作 */
    handleFilter(data) {
      this.filterObj = data
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240
      this.tableHeight = offsetHei - removeHeight
      this.currentPage = 1
      this.getList()
    },
    /** 场景操作 */
    handleScene(data) {
      this.sceneId = data.id
      this.sceneName = data.name
      this.currentPage = 1
      this.getFieldList()
    },
    /** 共有私有切换操作 */
    switchTab (data, typeId) {
      // this.sceneId = data
      // this.sceneName = data.name
      this.currentPage = 1
      if (this.crmType == 'leads') {
        this.status = data
      }
      if (this.crmType == 'customer' && typeId == '8') {
        this.isSeas = true
      } else {
        this.isSeas = false
      }
      this.filterObj = {}
      this.getFieldList()
    },
    /** 勾选操作 */
    handleHandle(data) {
      if (data.type === 'alloc' || data.type === 'get' || data.type === 'transfer' || data.type === 'transform' || data.type === 'delete' || data.type === 'put_seas') {
        this.showDview = false
      }

      if (data.type !== 'edit') {
        this.getList()
      }
    },
    /** 自定义字段管理 */
    setSave() {
      this.fieldList = []
      this.getFieldList()
    },
    /** */
    /** 页面头部操作 */
    listHeadHandle(data) {
      if (data.type === 'save-success') {
        // 重新请求第一页数据
        this.currentPage = 1
        this.getList()
      }
    },
    // 设置点击
    handleTableSet() {
      this.showFieldSet = true
    },
    /** 勾选操作 */
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      if (val.length == 1) {
        this.followId = val[0][this.crmType+'Id']
      }
      this.selectionList = val // 勾选的行
      this.$refs.crmTableHead.headSelectionChange(val)
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (column.property) {
        const crmType = this.isSeas ? this.crmType + '_pool' : this.crmType
        crmFieldColumnWidth({
          types: 'crm_' + crmType,
          field: column.property,
          width: newWidth
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data
            })
          })
          .catch(() => { })
      }
    },
    // 更改每页展示数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 0待审核、1审核中、2审核通过、3审核未通过
    getStatusStyle(status) {
      if (status == 0 || status == null) {
        return {
          'border-color': '#E6A23C',
          'background-color': '#FDF6EC',
          'color': '#E6A23C'
        }
      } else if (status == 1) {
        return {
          'border-color': '#409EFF',
          'background-color': '#ECF5FF',
          'color': '#409EFF'
        }
      } else if (status == 2) {
        return {
          'border-color': '#67C23A',
          'background-color': '#F0F9EB',
          'color': '#67C23A'
        }
      } else if (status == 3) {
        return {
          'border-color': '#F56C6B',
          'background-color': '#FEF0F0',
          'color': '#F56C6B'
        }
      } else if (status == 4) {
        return {
          'background-color': '#FFFFFF'
        }
      }
    },
    getStatusName(status) {
      if (status == 0 || status == null) {
        // return '待审核'
        return '未提交'
      } else if (status == 1) {
        return '审核中'
      } else if (status == 2) {
        return '通过'
      } else if (status == 3) {
        return '拒绝'
      } else if (status == 4) {
        return '撤回'
      }
      return ''
    },

    /**
     * 更新表高
     */
    updateTableHeight() {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240
      this.tableHeight = offsetHei - removeHeight
    },
    /** 新建商机 */
    createBusiness() {
      /** 客户 和 联系人 下可新建商机  */
      if (this.crmType == 'contacts') {
        this.createActionInfo.data['customer'] = this.detail
      } else if (this.crmType == 'customer') {
        this.createActionInfo.data['customer'] = this.detail
      }
      this.isCreateBusiness = true
    },
    createSaveSuccess () {

    }
  },
  watch: {
    sceneId (value) {
    }
  },

  beforeDestroy() { }
}
