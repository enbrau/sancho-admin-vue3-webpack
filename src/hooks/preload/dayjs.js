import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'

import settings from '@/../settings.js'

dayjs.extend(utc)
dayjs.extend(timezone)

if (settings.timezone) {
  dayjs.tz.setDefault(settings.timezone)
}

import store from '@/store'

export default function(app) {
  return new Promise((resolve) => {
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    
    switch(store.state.app.locale) {
      case 'zh-cn':
        dayjs.locale('zh-cn')
        break
      default:
        dayjs.locale('en')
    }
    app.config.globalProperties['$dayjs'] = dayjs
    resolve()
  })
}
