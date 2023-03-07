import path from 'path'
import fs from 'fs'

/**
 * 读取css变量
 */
const cssStr = fs
  .readFileSync(path.resolve(__dirname, './var.css'))
  .toString()

export default cssStr
