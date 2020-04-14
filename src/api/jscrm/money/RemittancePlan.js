import request from '@/utils/request'

export function queryPage(data) {
  return request({
    url: 'remittancePlan/queryPage',
    method: 'post',
    data: data,
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8'
            'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}



export function addData(data) {
  return request({
    url: 'remittancePlan/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}


export function updateData(data) {
  return request({
    url: 'remittancePlan/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

export function deleteData(data) {
  return request({
    url: 'remittancePlan/delete?id='+data.id,
    method: 'get',
  })
}


export function selectById(id) {
  return request({
    url: 'remittancePlan/selectById?id='+id,
    method: 'get',
  })
}

