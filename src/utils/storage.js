const supportStorage = typeof Storage !== 'undefined'
const TokenKey = 'X-API-TOKEN'
export function locals() {}
locals.set = function(key, value) {
  if (!supportStorage) return
  if (typeof value === 'string') {
    return window.localStorage.setItem(key, value)
  } else {
    return window.localStorage.setItem(key, JSON.stringify(value))
  }
}
locals.get = function(key) {
  if (!supportStorage) return
  const getItem = window.localStorage.getItem(key)
  try {
    return JSON.parse(getItem)
  } catch (error) {
    if (!getItem || getItem === 'undefined') return null
    return getItem
  }
}
locals.remove = function(key) {
  if (!supportStorage) return
  return window.localStorage.removeItem(key)
}

export function sessions() {}
sessions.set = function(key, value) {
  if (!supportStorage) return
  if (typeof value === 'string') {
    return window.sessionStorage.setItem(key, value)
  } else {
    return window.sessionStorage.setItem(key, JSON.stringify(value))
  }
}
sessions.get = function(key) {
  if (!supportStorage) return
  const getItem = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(getItem)
  } catch (error) {
    if (!getItem || getItem === 'undefined') return null
    return getItem
  }
}
sessions.remove = function(key) {
  if (!supportStorage) return
  return window.sessionStorage.removeItem(key)
}

export function getToken() {
  return locals.get(TokenKey)
}

export function setToken(token) {
  return locals.set(TokenKey, token)
}

export function removeToken() {
  return locals.remove(TokenKey)
}
