/**
 * 正则验证
 * 使用时只需要将文件引入
 * 在需要验证的地方使用 regexTest(regex_id, value) 即可。
 * 例如：ElementUI的自定义校验规则
 *
 * age: [{ validator: checkAge, trigger: 'blur' }],
 *
 * checkAge(rule, value, callback) {
 *  if (value === '') {
 *   callback(new Error('请输入年龄'))
 * } else {
 *  if (!regexTest('number-Reg', value)) {
 *   callback(new Error('请输入数字值'))
 * } else {
 *  callback()
 * }
 */

type RegexId = 'password-Reg'
  | 'phone-Reg'
  | 'landline-Reg'
  | 'telephone-Reg'
  | 'idCard-Reg'
  | 'email-Reg'
  | 'postalCode-Reg'
  | 'qq-Reg'
  | 'wechat-Reg'
  | 'carNumber-Reg'
  | 'bankCard-Reg'
  | 'socialCreditCode-Reg'
  | 'number-Reg'
  | 'chinese-Reg'
  | 'english-Reg'
  | 'uppercase-Reg'
  | 'lowercase-Reg'
  | 'integer-Reg'
  | 'decimal-Reg'
  | 'float-Reg'
  | 'positiveInteger-Reg'
  | 'positiveDecimal-Reg'
  | 'negativeInteger-Reg'
  | 'negativeDecimal-Reg'
  | 'date-Reg'
  | 'dateTime-Reg'
  | 'url-Reg'
  | 'ip-Reg'
  | 'mac-Reg'
  | 'html-Reg'
  | 'color-Reg'

interface RegexItem {
  name: string
  id: RegexId
  regex: RegExp
  value?: string
}

export const info_regex: RegexItem[] = [
  {
    name: '1.1 密码 (8-12位由数字、字母、特殊字符组成)',
    id: 'password-Reg',
    regex: /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,12}$/,
  },
  {
    name: '1.2 手机号',
    id: 'phone-Reg',
    regex: /^1[3456789]\d{9}$/,
  },
  // 国内座机电话
  // 1、区号：前面一个0，后面跟2-3位数字 ：0\d{2,3}
  // 2、电话号码：7-8位数字：\d{7,8}
  // 3、分机号：一般都是3-4位数字：\d{3,4}
  // 4、总结起来就是：区号+电话号码+分机号（分机号可有可无）
  // 5、如有空格，空格前后的数字个数之和应该是 8-12 位
  // 6、如有分机号，分机号前面要有 - 符号
  {
    name: '1.3 国内座机号',
    id: 'landline-Reg',
    regex: /^0\d{2,3}-?\d{7,8}$/,
  },
  // 是否电话格式(手机和座机)
  {
    name: '1.4 电话格式(手机和座机)',
    id: 'telephone-Reg',
    regex: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
  },
  {
    name: '1.5 身份证号',
    id: 'idCard-Reg',
    regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
  },
  {
    name: '1.6 邮箱',
    id: 'email-Reg',
    regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  },
  {
    name: '1.7 邮政编码',
    id: 'postalCode-Reg',
    regex: /^[1-9]\d{5}(?!\d)$/,
  },
  {
    name: '1.8 QQ号',
    id: 'qq-Reg',
    regex: /^[1-9][0-9]{4,10}$/,
  },
  // 微信官方定义的微信号规则
  // 1、可使用6-20个字母、数字、下划线和减号；
  // 2、必须以字母开头（字母不区分大小写）；
  // 3、不支持设置中文。
  {
    name: '1.9 微信号',
    id: 'wechat-Reg',
    regex: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/,
  },
  {
    name: '1.10 车牌号',
    id: 'carNumber-Reg',
    regex: /^[\u4E00-\u9FA5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
  },
  {
    name: '1.11 银行卡号',
    id: 'bankCard-Reg',
    regex: /^([1-9]{1})(\d{14}|\d{18})$/,
  },
  // https://www.cods.org.cn/c/2018-10-22/702.html
  {
    name: '1.12 统一社会信用代码',
    id: 'socialCreditCode-Reg',
    regex: /^[0-9A-Z]{18}$/,
  },
]

export const data_regex: RegexItem[] = [
  {
    name: '2.1 数字',
    id: 'number-Reg',
    regex: /^\d+$/,
  },
  {
    name: '2.2 中文',
    id: 'chinese-Reg',
    regex: /^[\u4E00-\u9FA5]+$/,
  },
  {
    name: '2.3 英文',
    id: 'english-Reg',
    regex: /^[a-zA-Z]+$/,
  },
  {
    name: '2.4 大写英文',
    id: 'uppercase-Reg',
    regex: /^[A-Z]+$/,
  },
  {
    name: '2.5 小写英文',
    id: 'lowercase-Reg',
    regex: /^[a-z]+$/,
  },
  {
    name: '2.6 整数',
    id: 'integer-Reg',
    regex: /^-?\d+$/,
  },
  {
    name: '2.7 小数',
    id: 'decimal-Reg',
    regex: /^-?\d+\.\d+$/,
  },
  {
    name: '2.8 浮点数',
    id: 'float-Reg',
    regex: /^(-?\d+)(\.\d+)?$/,
  },
  {
    name: '2.9 正整数',
    id: 'positiveInteger-Reg',
    regex: /^[1-9]\d*$/,
  },
  {
    name: '2.10 正小数',
    id: 'positiveDecimal-Reg',
    regex: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
  },
  {
    name: '2.11 负整数',
    id: 'negativeInteger-Reg',
    regex: /^-[1-9]\d*$/,
  },
  {
    name: '2.12 负小数',
    id: 'negativeDecimal-Reg',
    regex: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/,
  },
]

export const special_regex: RegexItem[] = [
  {
    name: '3.1 日期格式',
    id: 'date-Reg',
    regex: /^\d{4}-\d{1,2}-\d{1,2}$/,
  },
  {
    name: '3.2 日期时间格式',
    id: 'dateTime-Reg',
    regex: /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}$/,
  },
  {
    name: '3.3 URL',
    id: 'url-Reg',
    regex: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
  },
  {
    name: '3.4 IP',
    id: 'ip-Reg',
    regex: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
  },
  {
    name: '3.5 MAC地址',
    id: 'mac-Reg',
    regex: /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/,
  },
  {
    name: '3.6 HTML标签',
    id: 'html-Reg',
    regex: /^<(.*)>.*<\/\1>|<(.*) \/>$/,
  },
  {
    name: '3.7 16进制颜色',
    id: 'color-Reg',
    regex: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  },
]

/**
 * 正则验证
 * @param regex_id 正则id
 * @param value 需要验证的值
 * @returns boolean
 */
export function regexTest(regex_id: RegexId, value: string | number): boolean {
  const regex_all = info_regex.concat(data_regex).concat(special_regex)
  return regex_all.find(item => item.id === regex_id)?.regex.test(value.toString()) || false
}

// TODO
