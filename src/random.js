// 从谷歌V8引擎抄来的 https://github.com/v8/v8/blob/dae6dfe08ba9810abbe7eee81f7c58e999ae8525/src/math.js#L144
export class Random {
  constructor (seed) {
    if (seed === undefined) {
      seed = new Date().getTime()
    }
    this._rngstate = [seed & 0x0000FFFF, seed >>> 16]
  }

  // 返回[0, 1)
  random () {
    let r0 = (Math.imul(18030, this._rngstate[0] & 0xFFFF) + (this._rngstate[0] >>> 16)) | 0
    this._rngstate[0] = r0
    let r1 = (Math.imul(36969, this._rngstate[1] & 0xFFFF) + (this._rngstate[1] >>> 16)) | 0
    this._rngstate[1] = r1
    let x = ((r0 << 16) + (r1 & 0xFFFF)) | 0
    // Division by 0x100000000 through multiplication by reciprocal.
    return (x < 0 ? (x + 0x100000000) : x) * 2.3283064365386962890625e-10
  }

  // 返回[min, max]的整数
  randint (min, max) {
    return Math.floor(min + this.random() * (max - min + 1))
  }
}

// 生成[0, length)的随机序列，每次调用next()返回和之前不重复的值，直到[0, length)用完
export class RandomSequence {
  constructor (length, seed) {
    this._rng = new Random(seed)
    this._list = new Array(length)
    for (let i = 0; i < length; i++) {
      this._list[i] = i
    }
    this._nextMin = 0
  }

  next () {
    if (this._nextMin >= this._list.length) {
      this._nextMin = 0
    }
    let index = this._rng.randint(this._nextMin, this._list.length - 1)
    let result = this._list[index]
    this._list[index] = this._list[this._nextMin]
    this._list[this._nextMin] = result
    this._nextMin++
    return result
  }
}