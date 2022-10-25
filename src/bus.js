import mitt from 'mitt'
import store from '@/store'

const $EventBus = window.__EVENT_BUS__ || mitt()

let ws
if (!window.__EVENT_BUS__) {
  window.__EVENT_BUS__ = $EventBus

  $EventBus.init = function() {
    if (ws && ws.readyState !== 3) {
      return ws
    } else {
      const url = `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.hostname}${window.location.port ?  ':' + window.location.port : ''}${process.env.CONTEXT_PATH === '/' ? '' : process.env.CONTEXT_PATH}/system/bus`
      ws = new WebSocket(url)
      ws.onmessage = function(evt) {
        try {
          const msg_str = evt.data
          const data = JSON.parse(msg_str)
          const eventkey = data.eventKey
          const message  = data.message
          $EventBus.emit(eventkey, message)
        } catch (e) {
          console.log(e)
        }
      }
      ws.onopen = function() {
        store.dispatch('bus/setReadyState', ws.readyState)
      }
      ws.onerror = function() {
        store.dispatch('bus/setReadyState', ws.readyState)
      }
      ws.onclose = function() {
        store.dispatch('bus/setReadyState', ws.readyState)
      }
      return ws
    }
  }

  $EventBus.publish = function(eventKey, message) {
    const ws = $EventBus.init()
    const msg = JSON.stringify({ type: 'CustomBusEvent', eventKey, message })
    if (!ws || ws.readyState === 0) {
      setTimeout(function() {
        ws.send(msg)
      }, 200)
    } else {
      ws.send(msg)
    }
  }
}

export default $EventBus
