
import request from '@/utils/request'
/**
 * 保存案件
 * @param {*} data
 */
export function crmCaseSave(data) {
    return request({
      url: 'CrmCase/addOrUpdate',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
}

// crm 列表
export function crmCaseIndex(data) {
    return request({
      url: 'CrmCase/queryPageList',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
}

// crm 详情
export function crmCaseRead(data) {
    return request({
      url: 'CrmCase/queryById',
      method: 'post',
      data: data
    })
}

// /**
//  * 合同下回款
//  * @param {*} data 
//  */
// export function crmCaseQueryReceivables(data) {
//     return request({
//       url: 'CrmContract/qureyReceivablesListByContractId',
//       method: 'post',
//       data: data
//     })
// }

  /**
 * 合同下回款计划
 * @param {*} data 
 */
export function crmCaseQueryReceivablesPlan(data) {
    return request({
      url: 'CrmCase/queryByContract',
      method: 'post',
      data: data
    })
  }

  // 删除
export function crmCaseDelete(data) {
    return request({
      url: 'CrmCase/deleteByIds',
      method: 'post',
      data: data
    })
  }

/**
 * 保存跟进记录
 * @param {*} data 
 */
export function crmCaseRecordSave(data) {
    return request({
      url: 'CrmCase/addRecord',
      method: 'post',
      data: data
    })
  }

  /**
 * 跟进记录列表
 * @param {*} data 
 */
export function crmCaseRecordIndex(data) {
    return request({
      url: 'CrmCase/getRecord',
      method: 'post',
      data: data
    })
}

  /**
 * 实际回款记录
 * @param {*} data  传contractId（案件id）
 */
export function crmCaseQueryReceivables(data) {
    return request({
      url: 'remittancePlan/queryPage',
      method: 'post',
      data: data,
      // headers: {
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // }
    })
}
  /**
 * 发票记录
 * @param {*} data  传caseId（案件id）
 */
export function crmCaseInvoiceIndex(data) {
    return request({
      url: 'invoiceManage/queryPage',
      method: 'post',
      data: data
    })
}

  /**
 * 费用记录
 * @param {*} data  传caseId（案件id）
 */
export function crmCaseCostIndex(data) {
    return request({
      url: 'costManage/queryPage',
      method: 'post',
      data: data
    })
}
