
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

module.exports={
resolve :(...file) => path.resolve(__dirname, '..', ...file),
log : message => console.log(chalk.green(`${message}`)),
successLog : message => console.log(chalk.blue(`${message}`)),
errorLog :error => console.log(chalk.red(`${error}`)),
generateFile : (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
}
