import request from '@/utils/request'

export function queryPageListCase(data) {
  return request({
    url: 'CrmCase/queryPageList',
    method: 'post',
    data: data,
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8'
            'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}


export function selectPageContract(data) {
  return request({
    url: 'remittancePlan/selectPageContract',
    method: 'post',
    data: data,
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8'
            'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}



