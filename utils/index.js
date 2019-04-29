
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const root = process.cwd();
module.exports={
  resolve: file=> path.resolve(root, file),
  dirResolve:file=>path.resolve(__dirname,'..',file),
  log : message => console.log(chalk.green(`${message}`)),
  successLog : message => console.log(chalk.blue(`${message}`)),
  errorLog :error => console.log(chalk.red(`${error}`)),
  warnLog:warn => console.log(chalk.yellow(`${warn}`)),
  generateFile : (path, data) => {
    if (fs.existsSync(path)) {
      console.log(chalk.red(`文件${path}已存在`))
      return
    }
    return new Promise((resolve, reject) => {
        console.log(chalk.blue(`文件${path}正在生成，请稍后`))
      fs.writeFile(path, data, 'utf8', err => {
        if (err) {
          console.log(chalk.red(`${err.message}`))
          reject(err)
        } else {
          resolve(true)
          
        }
      })
    })
  }
}
