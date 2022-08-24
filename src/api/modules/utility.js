import request from '@/utils/request'

const ignoreEncryption = false

export function saveWorkspaces(data) {
  return request({
    url: `/utility/workspaces`,
    method: 'put',
    data: { data },
    ignoreEncryption
  })
}

export function fetchWorkspaces(searchParam, page) {
  return request({
    url: `/utility/workspaces`,
    method: 'post',
    data: {
      data: {
        searchParam, page
      }
    },
    ignoreEncryption
  })
}

export function fetchWorkspace(id) {
  return request({
    url: `/utility/workspace/${id}`,
    method: 'get',
    ignoreEncryption
  })
}

export function dropWorkspace(id) {
  return request({
    url: `/utility/workspace/${id}`,
    method: 'delete',
    ignoreEncryption
  })
}

export function saveObject(data) {
  return request({
    url: `/utility/object`,
    method: 'post',
    data: { data },
    ignoreEncryption
  })
}

export function saveObjects(data) {
  return request({
    url: `/utility/objects`,
    method: 'put',
    data: { data },
    ignoreEncryption
  })
}

export function fetchObjects(searchParam, page) {
  return request({
    url: `/utility/objects`,
    method: 'post',
    data: {
      data: {
        searchParam, page
      }
    },
    ignoreEncryption
  })
}

export function fetchObject(id) {
  return request({
    url: `/utility/object/${id}`,
    method: 'get',
    ignoreEncryption
  })
}

export function dropObject(id) {
  return request({
    url: `/utility/object/${id}`,
    method: 'delete',
    ignoreEncryption
  })
}
