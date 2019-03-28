$(document).ready(function () {
  
  var act
  var res
  var lastIn
  var lastOp
  var opCount
  var decPoint
  var textField = $('#display')

  $('.op').click(function () { op(this.textContent) })
  $('.cl').click(function () { cl(this.textContent) })
  $('.dig, .dp').click(function () { dig(this.textContent) })
  $('body').keypress(function (e) {
    e.preventDefault()
    let k = e.keyCode
    let s = String.fromCharCode(e.charCode)
    if (k == 8) { // backspace
      cl('CL')
    }
    else if (k == 13) { // enter
      op('=')
    }
    else if (k == 27) { // escape
      cl('CA')
    }
    else if (s == '.' || s >= '0' && s <= '9') {
      dig(s)
    }
    else if (
      s == '+' ||
      s == '-' ||
      s == '*' ||
      s == '/' ||
      s == '='
    ) {
      op(s)
    }
  })
  
  function dig (c) {
    
    var i, v
    opCount = 0
    
    if (c == '.') {
      if (lastIn >= '0' && lastIn <= '9' && ! decPoint) {
        decPoint = true
        lastIn = c
        addChar(c)
      }
      return
    }

    if (lastIn == '=') {
      clearAll()
    }

    addChar(c)
    v = $(textField).val()

    i = getOpPos(v)
    if (i) {
      act = parseFloat(v.substr(i + 1))
    }
    else {
      act = parseFloat(v)
    }

    lastIn = c
  }
  
  function cl (v) {
    lastIn = v
    if (v === 'CA') {
      clearAll()
    }
    else {
      clearLast()
    }
  }
  
  function op (v) {
    if (lastOp == '=' || lastIn >= '0' && lastIn <= '9') {
      opCount++
      calc(v)

      lastIn = lastOp = v
      if (v == '=') {
        v = ''
      }
      $(textField).val(res + v)
    }
    else if (isOp(lastIn)) {
      lastIn = lastOp = v
      if (opCount === 0) {
        opCount++
        addChar (v)
      }
      else {
        patchChar(v)
      }
    }
  }
  
  function calc() {
    if (lastOp != '=') {
      switch (lastOp) {
      case '+': res += act; break
      case '-': res -= act; break
      case '*': res *= act; break
      case '/': res /= act; break
      }
    
      decPoint = false
      act = 0
    }
  }
  
  function addChar (c) {
    if ($(textField).val() === '0')
      $(textField).val(c)
    else
      $(textField).val($(textField).val() + c)
  }

  function patchChar(v) {
    var len = $(textField).val().length - 1
    $(textField).val($(textField).val().substr(0, len) + v)
  }
  
  function clearAll () {
    $(textField).val('0')
    res = act = 0
    opCount = 1
    lastIn = ''
    lastOp = '+'
    decPoint = false
  }
  
  function getOpPos (v) {
    var i = 1
    while (i < v.length) {
      if (isOp(v.substring(i, i+1))) {
        return i
      }
      i++
    }

    return 0
  }
  
  function isOp (c) {
    return (
      c == '+' ||
      c == '-' ||
      c == '*' ||
      c == '/')
  }
  
  function clearLast () {
    var v = $(textField).val()
    var l = v.length
    var c, i
    if (l--) {
      c = v.substr(l)
      v = v.substring(0, l)
      if (isOp(c)) {
        i = v.indexOf('.')
        if (i == -1) {
          decPoint = false
        }
        else {
          decPoint = true
        }
        act = res
        res = opCount = 0
      }
      else {
        if (c != '.') {
          if (v) {
            i = getOpPos(v)
            if (i) {
              act = parseFloat(v.substr(i + 1))
              if (isNaN(act)) {
                act = 0
              }
            }
            else {
              act = parseFloat(v)
            }
          }
          else {
            act = 0
          }
        }
        else {
          decPoint = false
        }
      }
      $(textField).val(v)
    }
  }
  
  clearAll()
})