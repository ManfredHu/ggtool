import URL from '@/util/url'

const realUrl = 'https://m.999.mm.com/m_nn/active/gc.wtf.nocache.html?__channel=nkm&debug=1&timer=1&clearLocal=1&x_xxx_m=on&log=1#/abc?timer=1123&name=mygirls'
const testUrl = 'http://user:pass@www.tmtpost.com:8080/p/a/t/h/2737087.html?mobile=1&mdebug=1&_test=1#haha=init&lh=1'
const checkIsLinkTest = 'https://abasc.qqwe.com/mobile/heiheiehie/index.html?phone=13800138000&source=755_lt&code=0610uEBn0Od1Vl1zWNyn0DbyBn00uEBQ&state=123#/order?pid=9'
const checkIsHashTest = 'goodsDetail'
const newTestUrl = 'http://www.baidu.com?hehe=test&abc=1&phone=18682193117&source=20_dx&debug=vconsole&nofans=1&idcard=441502199401262516&code=021NlJ870yuCmF1hdZ970jc2970NlJ8H'
const newTestUrl2 = 'http://www.baidu.com?hehe=test&abc=1&phone=18682193117&source=20_dx&debug=vconsole&nofans=1&idcard=441502199401262516&code=021NlJ870yuCmF1hdZ970jc2970NlJ8H#abc'
const checkIsLinkTest2 = '//baidu.com/aics-cloud/xiaomi/page.do?channel=21115&id=24638123'
const newTestUrl3 = `http://127.0.0.1:9110/vdata/contractPhoneIndex_utf8.js`

test('parse url', () => {
  expect(URL(testUrl).port).toBe('8080')
  expect(URL(testUrl).protocol).toBe('http')
  expect(URL(testUrl).getQueryParam('mobile')).toBe('1')
  expect(URL(testUrl).getQueryParam('mdebug')).toBe('1')
  expect(URL(testUrl).getQueryParam('_test')).toBe('1')
  expect(URL(testUrl).getUrlParam('_test')).not.toBe('2')
  expect(URL(testUrl).getUrlParam('test')).toBeFalsy()
  expect(URL(testUrl).getHashParam('haha')).toBe('init')
  expect(URL(realUrl).format()).toBe(realUrl)
  expect(URL(testUrl, {
    port: '443',
    protocol: 'https'
  }).port).toBe('443')
  expect(URL(testUrl, {
    port: '443',
    protocol: 'https'
  }).protocol).toBe('https')
  expect(URL(realUrl, {
    protocol: 'http'
  }).protocol).toBe('http')
  expect(URL(realUrl).format({
    protocol: 'http'
  })).toBe(realUrl.replace(/https/, 'http'))
  expect(checkSetMethod()).toBe(realUrl.replace(/https/, 'http'))

  expect(URL(testUrl, {
    port: '443',
    protocol: 'https',
    jj: 1
  }).port).toBe('443')
  expect(URL(realUrl).format({
    protocol: 'http',
    jj: 1
  })).toBe(realUrl.replace(/https/, 'http'))
})

test('url pass null', () => {
  function execUrl() {
    URL(null)
  }
  expect(execUrl).toThrow(/must be string/)
  expect(URL().protocol).toBe('http')
  expect(URL().host).toBe('localhost')
})

test('get url chain', () => {
  expect(new URL(realUrl).getHashParam('timer')).toBe('1123')
  expect(URL(realUrl).getHashParam('timer')).toBe('1123')
  expect(URL(realUrl).getHashParam('time')).toBe('')
})

test('getAllQueryParams', () => {
  expect(new URL(realUrl).getAllQueryParams().debug).toBe('1')
})

test('getAllHashParams', () => {
  expect(new URL(realUrl).getAllHashParams().name).toBe('mygirls')
})

test('validUrl', () => {
  expect(URL().validUrl(checkIsHashTest)).toBeFalsy()
  expect(URL().validUrl(checkIsLinkTest)).toBeTruthy()
  expect(URL(checkIsLinkTest).validUrl()).toBeTruthy()
  expect(URL().validUrl(checkIsLinkTest2)).toBeTruthy()
})

function checkSetMethod() {
  const parseObj = URL(realUrl)
  parseObj.protocol = 'http'

  return parseObj.format()
}

test('validUrl', () => {
  expect(URL().validUrl(checkIsHashTest)).toBeFalsy()
  expect(URL().validUrl(checkIsLinkTest)).toBeTruthy()
  expect(URL(checkIsLinkTest).validUrl()).toBeTruthy()
  expect(URL().validUrl('http://localhost:8090/#/record')).toBeTruthy()
  expect(URL().validUrl('http://88.8.888.82/project/hehehe/index.html/#/record')).toBeTruthy()
})

test('addQueryParam', () => {
  expect(URL(URL(realUrl).addQueryParam({
    debug: 2
  })).getQueryParam('debug')).toBe('2')
  expect(URL(URL(realUrl).addQueryParam({
    debug: 1
  })).getQueryParam('debug')).toBe('1')
  expect(URL(URL(realUrl).addQueryParam({
    debug: 1,
    wtf: 'myName'
  })).getQueryParam('wtf')).toBe('myName')
  expect(URL(URL(realUrl).addQueryParam({
    debug: 1,
    wtf: 'myName'
  })).getQueryParam('ftw')).toBe('')

  expect(URL(URL(realUrl).addQueryParam('/path/path?debug=1&wtf=myName')).getQueryParam('wtf')).toBe('myName')
  // 2020-2-17 bug
  expect(
    URL(
      URL('http://localhost:9110/?timeType=day#/deal').addQueryParam(
        'timeType='
      )
    ).getQueryParam('timeType')
  ).toBe('')
})

test('removeQueryParam', () => {
  expect(URL(URL(realUrl).removeQueryParam({
    debug: 2
  })).getQueryParam('debug')).toBe('')
  expect(URL(URL(realUrl).removeQueryParam('debug')).getQueryParam('debug')).toBe('')
  const temp = URL(URL(realUrl).removeQueryParam(['debug', '__channel']))
  expect(temp.getQueryParam('debug')).toBe('')
  expect(temp.getQueryParam('__channel')).toBe('')
})

test('addHashParam', () => {
  const temp = URL(URL(realUrl).addHashParam({
    debug: 2
  }))
  expect(temp.getHashParam('debug')).toBe('2')
  expect(URL(URL(realUrl).addHashParam({
    debug: 1,
    wtf: 'myName'
  })).getHashParam('ftw')).toBe('')
  expect(URL(URL(realUrl).addHashParam('/path/path?debug=1&wtf=myName')).getHashParam('wtf')).toBe('myName')
  const temp2 = URL(URL(newTestUrl).addHashParam('aaa=2'))
  expect(temp2.getHashParam('aaa')).toBe('2')
  const temp3 = URL(URL(newTestUrl2).addHashParam('aaa=2'))
  expect(temp3.getHashParam('aaa')).toBe('2')
})

test('removeHashParam', () => {
  expect(URL(URL(realUrl).removeHashParam({
    timer: 2
  })).getHashParam('timer')).toBe('')
  expect(URL(URL(realUrl).removeHashParam('timer')).getHashParam('timer')).toBe('')
  const temp = URL(URL(realUrl).removeHashParam(['timer', 'name']))
  expect(temp.getHashParam('timer')).toBe('')
  expect(temp.getHashParam('name')).toBe('')
})

test('removeProtocal', () => {
  // same
  expect(URL(realUrl).removeProtocal()).toBe('//m.999.mm.com/m_nn/active/gc.wtf.nocache.html?__channel=nkm&debug=1&timer=1&clearLocal=1&x_xxx_m=on&log=1#/abc?timer=1123&name=mygirls')
  expect(URL(realUrl).format({
    protocol: ''
  })).toBe('//m.999.mm.com/m_nn/active/gc.wtf.nocache.html?__channel=nkm&debug=1&timer=1&clearLocal=1&x_xxx_m=on&log=1#/abc?timer=1123&name=mygirls')
})

test('parseLocalhostUrl', () => {
  expect(URL(newTestUrl3)._parsedObj.host).toBe('127.0.0.1:9110')
})
