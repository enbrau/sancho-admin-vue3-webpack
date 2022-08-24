module.exports = [
  {
    url: '/utility/objects',
    method: 'post',
    statusCode: 200,
    response: () => {
      return {
        flag: 0,
        data: { datalist: [] },
        msg: null
      }
    }
  },
  {
    url: '/utility/object',
    method: 'put',
    statusCode: 200,
    response: () => {
      return {
        flag: 0,
        data: null,
        msg: null
      }
    }
  }
]
