#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const utils = require('./utils');
const version =require('./package.json').version;
const templage=require('./template.json');
const {
  vueTemplate
} = require('./config/template');
const jsonTemplate = {};
const filter = [];

program
  .version(version)
  .option('-s --save [save]', '文件输出的位置')
  .option('-n --name [name]', '文件名称')
  .option('-k --key [key]', '文件唯一标识')
  .action(async env => {
    let options=cleanArgs(env);
    if(options.save && options.name && options.key){
        await setAllCommander();
    }else{
        utils.errorLog('您未设置全部参数，若不知道参数，请使用autopage -h')
    }
      // dir.Command.Option(option => {
      //   // console.log(option)
      // });
  })
  .parse(process.argv);


const filePaths = program.save;
const fileName= program.name?program.name:'tableComponents';
const fileKey=program.key?program.key:'tableKey';
async function setAllCommander(){
   await prompt([
     /**
      * 是否使用通用模板，若选择是则不再询问更多讯息
      */
     {
       type: 'confirm',
       name: 'isAuto',
       message: '是否使用通用模板',
       default: true
     }
   ]).then(async answers => {
     let templatejson = templage
     if (!answers.isAuto) {
       await isExporter();
       await isPagination();
       await getTableDataUrl();
       await isUrl('filter');
       await isUrl('tableHeader')
       templatejson = jsonTemplate;
     }
     await setFilePage(filePaths, fileName, fileKey, templatejson);
   });
}

/**
 * 是否需要导出
 */
async function isExporter() {
  await prompt([{
    type: 'input',
    name: 'isExporter',
    message: `是否需要导出链接,如不需要导出功能则跳过`,
    default: 'bo/getService'
  }]).then(ans => {
    jsonTemplate.isExport = ans.isExporter;
    return ans;
  })
}
/**
 * 
 *是否需要分页器
 */
async function isPagination() {
  await prompt([{
    type: 'confirm',
    name: 'isPagination',
    message: `是否需要分页`,
    default: true
  }]).then(ans => {
    jsonTemplate.hasPagination = ans.isPagination;
    return ans;
  })
}
/**
 * table数据后端接口
 */
async function getTableDataUrl() {
  await prompt([{
    type: 'input',
    name: 'tableDataUrl',
    message: `请输入表格数据的接口`,
  }]).then(ans => {
    jsonTemplate.tableDataUrl = ans.tableDataUrl;
    return ans;
  })
}
/**
 * 是否使用数据库配置的筛选条件
 *
 */
async function isUrl(type) {
  const typelist = {
    filter: '筛选条件',
    tableHeader: '表头信息'
  }
  //  utils.log(`配置${type}是否使用数据库配置项？`);
  await prompt([
    /**
     * 是否使用通用模板，若选择是则不再询问更多讯息
     */
    {
      type: 'confirm',
      name: 'isSetting',
      message: `配置${typelist[type]}是否使用数据库配置项？`,
      default: true
    }
  ]).then(async answers => {
    if (type === 'filter') {
      await setFilterUrl(answers.isSetting);
    } else if (type === 'tableHeader') {
      await setTableHeader(answers.isSetting);
    }

  });
}

/**
 * 
 * @param {Boolean} isSetting 
 */
async function setFilterUrl(isSetting) {
  await prompt([{
    type: 'input',
    name: 'filterUrl',
    message: '请输入筛选条件的后端接口',
    default: '/report/filterCondition'
  }]).then(async ans => {
    jsonTemplate.filterUrl = ans.filterUrl;
    if (!isSetting) {
      await setFilter();
    }
  })
}

async function setTableHeaderUrl() {
  await prompt([{
    type: 'input',
    name: 'tableHeaderUrl',
    message: '请输入获取表头的rul'
  }]).then(async ans => {
    jsonTemplate.tableHeaderUrl = ans.tableHeaderUrl;
  })
}
/**
 * 设置筛选条件
 * 
 */
async function setFilter() {
  await prompt([
    /**
     * 需要添加几个筛选条件
     */
    {
      type: 'input',
      name: 'selectorNum',
      message: '需要添加几个筛选条件(请输入数字)'
    }
  ]).then(async ans => {
    if (isNaN(Number(ans.selectorNum))) {
      utils.errorLog('输入的并不是数字，请重新输入')
      await setFilter();
      return;
    } else {
      for (let i = 0; i < Number(ans.selectorNum); i++) {
        await setFilterContent();
      }
      filter.length !== 0 && (jsonTemplate.filter = filter);

    }

  })
}
/**
 * 设置筛选条件详细内容
 */
async function setFilterContent() {

  return inquirer.prompt([
    /**
     * 需要添加几个筛选条件
     */
    {
      type: 'rawlist',
      name: 'type',
      message: '筛选框的类型',
      choices: [
        'selector',
        'input',
        'date'
      ]
    }, {
      type: 'input',
      name: 'key',
      message: '选择框获取数值的key名',
    }, {
      type: 'input',
      name: 'label',
      message: '选择框label名称',
    }
  ]).then(ans => {
    filter.push(ans);
  })


}
/**
 * 设置表头信息
 */
async function setTableHeader(isSetting) {
  if (isSetting) {
    await setTableHeaderUrl();
  } else {
    await prompt([{
      type: 'input',
      name: 'tableHeaderNum',
      message: `请输入你想配置的表头个数`,
    }]).then(async ans => {
      let tableHeaderNum = Number(ans.tableHeaderNum);
      if (isNaN(tableHeaderNum)) {
        utils.errorLog('输入的并不是数字，请重新输入')
        await setTableHeader();
        return;
      } else {
        tableHeaderNum>7 && utils.warnLog('您想要配置的表头多于7个，确定不使用数据库配置表头？')
        jsonTemplate.tableHeader || (jsonTemplate.tableHeader = []);
        let result = {};
        for (let i = 0; i < tableHeaderNum; i++) {
          result = await setHeaderContent();
          jsonTemplate.tableHeader.push(result);
        }


      }
    })
  }

}
/**
 * 
 * @param {*} questions 
 */
async function setHeaderContent() {
  let result = {};
  await prompt([
    /**
     * 需要添加几个筛选条件
     */
    {
      type: 'rawlist',
      name: 'type',
      message: '请输入表头类型',
      choices: [
        'selection',
        'index',
        'expand'
      ]
    }, {
      type: 'input',
      name: 'prop',
      message: '请输入表头关联的key',
    }, {
      type: 'input',
      name: 'label',
      message: '请输入表头名称',
    }, {
      type: 'input',
      name: 'width',
      message: '请输入表头宽度',
    }, {
      type: 'input',
      name: 'url',
      message: '请输入此行需要跳转的页面'
    }
  ]).then(async ans => {
    result = ans;
    if (ans.url) {
      await prompt([{
        type: 'input',
        name: 'jumpPayload',
        message: '请输入跳转时需要的参数，使用&符号连接',
      }]).then(anss => {
        result.jumpPayload = anss.jumpPayload;
      });
    }


  })
  return result;

}
/**
 * 
 * 封装inquirer，统一处理
 */
function prompt(questions) {
  return new Promise((resolve, reject) => {
    inquirer.prompt(questions).then(ans => resolve(ans)).catch(err => reject(err));
  })
}

/**
 * 生成文件文档
 */
async function setFilePage(path,name,key,template){
  
  let filePath = utils.resolve(`${path}/${name}.vue`);
  template.fileKey=key;
  template.fileName=name;
  await utils.generateFile(`${filePath}`, vueTemplate(template))
}

/**
 * 整理option
 * @param {Object} cmd 
 */
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
/**
 * 大小写转换
 * @param {String} str 
 */
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}