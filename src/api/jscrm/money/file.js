import request from '@/utils/request'

/**
 * 
 * @param 获取batchId 
 */
export function getBatchId() {
  return request({
    url: 'upload/getBatchId',
    method: 'get',
  })
}

export function upload(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'file/upload',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export function uploadMultiple(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'upload/uploadMultiple?batchId='+data.batchId,
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function queryPageFile(data) {
  return request({
    url: 'file/queryByBatchId?batchId='+data,
    method: 'get',
  })
}

/**
 * 
 * @param 下载
 */
export function download(id) {
  return request({
    url: 'upload/download?id='+id,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}


