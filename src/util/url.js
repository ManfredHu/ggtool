import Parse from 'url-parse'

class URL {
  constructor(link, option) {
    if (typeof link === 'undefined' && window) {
      link = window && window.location && window.location.href
    }

    if (!link) {
      throw new Error('link must be string')
    }

    this._parsedObj = new Parse(link, true)

    this._attrArr = ['protocol', 'hash', 'query', 'pathname', 'auth', 'host', 'port', 'hostname', 'password', 'username', 'origin', 'href']
    this._attrArr.forEach(item => {
      Object.defineProperty(this, item, {
        enumerable: true,
        configurable: true,
        get: () => {
          if (item === 'protocol') {
            return this._parsedObj[item].replace(/:$/, '')
          } else {
            return this._parsedObj[item]
          }
        },
        set: (newValue) => {
          this._parsedObj.set(item, newValue)
        }
      })
    })

    for (const i in option) {
      if (this._attrArr.indexOf(i) > -1) {
        this._parsedObj.set(i, option[i])
      }
    }
    return this
  }

  getQueryParam(key) {
    return this._parsedObj.query[key]
  }

  getAllQueryParams() {
    return this._parsedObj.query
  }

  getUrlParam(key) {
    return this.getQueryParam(key)
  }

  getHashParam(key) {
    const hash = this._parsedObj.hash
    const reg = new RegExp('[^|#|&]?' + key + '=([^&]*(?=&|$))')
    const matchResult = hash.match(reg)
    if (matchResult && matchResult[1]) {
      return matchResult[1]
    }
    return ''
  }

  format(option) {
    for (const i in option) {
      if (this._attrArr.indexOf(i) > -1) {
        this._parsedObj.set(i, option[i])
      }
    }
    return this._parsedObj.toString()
  }

  getAllHashParams() {
    const matchArr = this._parsedObj.hash.match(/(\w+=\w+)/g)
    const obj = {}
    if (matchArr) {
      matchArr.forEach(i => {
        const [key, value] = i.split('=')
        obj[key] = value
      })
    }
    return obj
  }

  validUrl(str) {
    if (!str) str = this.format()
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#\/?[-a-z\\d_]*)?(\\?[;&a-z\\d%_.~+=-]*)?$', 'i') // fragment locator
    return !!pattern.test(str)
  }
}

function getUrl(link, option) {
  return new URL(link, option)
}

export default getUrl
