import lodash from 'lodash'

export function typeOf(obj) {
  let res = Object.prototype.toString.call(obj).split(' ')[1]
  res = res.substring(0, res.length - 1).toLowerCase()
  return res
}

export function isEmpty(target) {
  if (target === undefined || target === null) {
    return true
  }
  if (typeof (target) === 'string' && target.trim() === '') {
    return true
  }
  return target instanceof Array && target.length === 0;
}

export function debounce(func, wait, immediate) {
  let timeout, result
  
  const debounced = function () {
      var context = this;
      var args = arguments;
      
      if (timeout) clearTimeout(timeout);
      if (immediate) {
          // 如果已经执行过，不再执行
          var callNow = !timeout;
          timeout = setTimeout(function(){
              timeout = null;
          }, wait)
          if (callNow) result = func.apply(context, args)
      } else {
          timeout = setTimeout(function(){
              func.apply(context, args)
          }, wait);
      }
      return result;
  };

  debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
  };

  return debounced;
}

export function getCookie(name) {
  return `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift()
}

export function setCookie(name,value){
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*30);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

export function expireAllCookies(name, paths) {
  var expires = new Date(0).toUTCString();

  // expire null-path cookies as well
  document.cookie = name + '=; expires=' + expires;

  for (var i = 0, l = paths.length; i < l; i++) {
      document.cookie = name + '=; path=' + paths[i] + '; expires=' + expires;
  }
}

export function expireActiveCookies(name) {
  var pathname = location.pathname.replace(/\/$/, ''),
      segments = pathname.split('/'),
      paths = [];

  for (var i = 0, l = segments.length, path; i < l; i++) {
      path = segments.slice(0, i + 1).join('/');

      paths.push(path);       // as file
      paths.push(path + '/'); // as directory
  }

  expireAllCookies(name, paths);
}

export function clearCookies() {
  document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`))
}

export function isSystemDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getParameters(url) {
  const URL = url || window.location.href
  if (URL.indexOf('?') < 0) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURI(URL.split("?")[1])
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
     '"}'
  )
}

export function deepClone(source, strict) {
  if (strict) {
    return lodash.deepClone(source)
  }
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export {default as resolvePath} from './resolvePath.mjs'

export function uuid() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid.replaceAll('-', '');
}
