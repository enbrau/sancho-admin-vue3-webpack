const settings = require('./data/settings.json')
const dicts = require('./data/dicts.json')

module.exports = [
  {
    url: '/common/dicts',
    method: 'get',
    statusCode: 200,
    response: () => {
      return {
        flag: 0,
        data: dicts,
        msg: null
      }
    }
  },
  {
    url: '/common/settings',
    method: 'get',
    statusCode: 200,
    response: () => {
      return {
        flag: 0,
        data: settings,
        msg: null
      }
    }
  }
]