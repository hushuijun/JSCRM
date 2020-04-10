import request from '@/utils/request'

export function queryPageList(data) {
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



