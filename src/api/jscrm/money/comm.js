import request from '@/utils/request'

export function selectPageCase(data) {
  return request({
    url: 'remittancePlan/selectPageCase',
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



