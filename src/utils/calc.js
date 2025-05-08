import * as math from 'mathjs';

export default {
  /**
 * 加法
 * @param {*} num1 
 * @param {*} num2 
 */
  add: function (num1, num2) {
    num1 = num1 ? Number(num1) : 0
    num2 = num2 ? Number(num2) : 0
    return math.number(math.add(math.bignumber(num1), math.bignumber(num2)));
  },
  /**
   * 减法
   * @param {*} num1 
   * @param {*} num2 
   */
  subtract: function (num1, num2) {
    num1 = num1 ? Number(num1) : 0
    num2 = num2 ? Number(num2) : 0
    return math.number(math.subtract(math.bignumber(num1), math.bignumber(num2)));

  },
  /**
   * 乘法
   * @param {*} num1 
   * @param {*} num2 
   */
  multiple: function (num1, num2) {
    num1 = num1 ? Number(num1) : 0
    num2 = num2 ? Number(num2) : 0
    return math.number(math.multiply(math.bignumber(num1), math.bignumber(num2)));

  },
  /**
   * 除法
   * @param {*} num1 
   * @param {*} num2 
   */
  divide: function (num1, num2) {
    num1 = num1 ? Number(num1) : 0
    num2 = num2 ? Number(num2) : 0
    return math.number(math.divide(math.bignumber(num1), math.bignumber(num2)));


  }
}