import request from '@/utils/request'

// 审批流程列表
export function queryPage(data) {
  return request({
    url: 'invoiceManage/queryPage',
    method: 'post',
    data: data,
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8'
            'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}



// 审批流程创建
export function addData(data) {
  return request({
    url: 'invoiceManage/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}


export function updateData(data) {
  return request({
    url: 'invoiceManage/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

/**
 * 审批流程删除 启用 禁用
 * @param {*} data
 * id 审批流ID
 */
export function deleteData(data) {
  return request({
    url: 'invoiceManage/delete?id='+data.id,
    method: 'get',
  })
}


export function selectById(id) {
  return request({
    url: 'invoiceManage/selectById?id='+id,
    method: 'get',
  })
}

