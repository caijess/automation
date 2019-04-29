// template.js
module.exports = {
  vueTemplate: (opts = {}) => {
    console.log(opts);
    let name =JSON.stringify(opts.fileName);
    opts = JSON.stringify(opts);
    console.log(opts);
    return `<template>
    <div class="right-main">
      <el-row>
        <el-col :span="24">
          <selectInputExport ref="conditionHead" :textContext="textContext" :selectContext.sync="selectContext" :datePickerContext="datePickerContext" :exportInfo="exportInfo" @query="clickQuery" @exportTable="exportTable" @getSelectChange="getSelectChange"></selectInputExport>
        </el-col>
      </el-row>
      <el-row class="right-main__table">
        <reportTable v-if="hasData" ref="reportTable" @getPages="getPageInfo" :tableHeader="tableHeader" :type="type" :showPage="pageInfo.isShow" :list="tableinfo" :totalCount="pageInfo.totalCount">
          <template v-for='(jumpHead,index) in  defineHeader.jumpHeader' #[jumpHead.prop]='row'>
            <div :key="jumpHead.prop">
              <span class="table-cell__click" @click="cellJump(row,index)">{{row .rowData}}</span>
            </div>
          </template>
        </reportTable>
      </el-row>

    </div>
  </template>

<script>
import axios from 'axios';
import reportTable from './components/tables';
import selectInputExport from './components/condition';


export default {
  name: 'test1',
  data() {
    return {
      reportFormInfo: { isExport: 'wer/erw', hasPagination: false, tableDataUrl: '/report/getFormTableData', filterUrl: '/report/filterCondition', filter: [{ type: 'select', key: 'city', label: '城市' }, { type: 'input', key: 'keyname', label: '关键字' }, { type: 'date', key: 'date', label: '日期' }], tableHeader: [{ type: 'selection', prop: '-', label: '-', width: '110', url: '' }, { type: 'index', prop: 'index', label: 'fdfd', width: '120', url: '' }], fileKey: '11121212', fileName: 'test1' },
      hasData: false,
      // 输入框样式
      textContext: {
        isShow: false, // 是否显示
        data: []
      },
      // 下拉框参数样式
      selectContext: {
        isShow: false, // 是否显示
        data: []
      },
      datePickerContext: {
        isShow: false, // 是否显示
        data: []
      },
      tableHeader: [],
      defineHeader: {
        jumpHeader: []
      },
      jumpHeader: {
        prop: 'serveResponseTime',
        label: '服务器响应时间1',
        align: 'center',
        url: 'tableContent',
        type: 'selection/index/expand'
      },
      pageInfo: {
        isShow: false,
        totalCount: 0
      },
      exportInfo: {
        isShow: false // 是否显示
      },
      clickCellName: 'applicationName',
      // timeStamp: '30 * 60 * 1000',
      type: 'webPageOnLoad',
      // tableData: [],
      searchCellName: 'applicationName',
      statusDisplayName: 'status',
      tableinfo: [],

      childrenName: 'serviceList',
      childName: 'serviceName'
    };
  },
  mounted() {
    console.log(2);
  },
  created() {
    this.analysisReportInfo();
  },
  methods: {
    /**
         * 解析读取json数据.
         * @method analysisReportInfo
         */
    async analysisReportInfo() {
      const keys = Object.keys(this.reportFormInfo);
      // 查询条件两种情况,1、只有filterUrl，根据接口去查找条件返回；2、filter查询项，根据filterUrl，select的选项；
      if (keys.includes('filter')) { // 获取查询条件
        this.filterConditon = this.reportFormInfo.filter;
        this.getInitOptions(this.reportFormInfo.filterUrl); // 获取option值
      } else {
        this.getFormCondition(this.reportFormInfo.filterUrl); // 从接口请求查询条件
      }
      if (keys.includes('tableHeaderUrl')) { // 判断是否配置tabletableHeaderUrl
        await this.getTableHeader(this.reportFormInfo.tableHeaderUrl); // 获取查询条件
      } else {
        this.tableHeader = this.reportFormInfo.tableHeader;
      }
      this.getSlotHeader(); // 自定义样式head
      this.hasData = true;
      if (keys.includes('isExport')) { // 展示导出按鈕
        this.exportInfo.isShow = true;
        this.exportInfo.url = this.reportFormInfo.isExport;
        this.exportInfo.params = '';
      }
      if (keys.includes('hasPagination')) { // 是否分页
        this.pageInfo.isShow = this.reportFormInfo.hasPagination;
      }
    },
    /**
         * 点击跳转事件.
         * @method cellJump
         */
    cellJump(row, index) {
      const head = this.defineHeader.jumpHeader[index];
      const params = head.jumpPayload.split('&');
      const query = {};
      params.forEach((param) => {
        query[param] = row.rows[param];
      });
      this.$router.push({ path: head.url, query });
    },
    /**
         * 自定义表头数据.
         * @method getSlotHeader
         */
    getSlotHeader() {
      this.tableHeader.forEach((item) => {
        if (Object.keys(item).includes('url') && item.url !== '') {
          this.defineHeader.jumpHeader.push(item);
        }
      });
    },
    /**
         * 根据查询条件接口url获取查询条件.
         * @method getFormCondition
         * @param {String} url 接口地址.
         */
    async getFormCondition(url) {
      const res = await this.getFormFilter(url);
      this.reportFormInfo.getChildSel = res.data.childSel;
      this.filterConditon = res.data.condition;
      this.dealCondition();
    },
    /**
         * 根据查询条件接口url获取option值.
         * @method getInitOptions
         * @param {String} url 接口地址.
         */
    async getInitOptions(url) {
      const res = await this.getFormFilter(url);
      this.reportFormInfo.getChildSel = res.data.childSel;
      const options = res.data.condition;
      this.dealOptions(options);
    },
    /**
         * 根据接口url获取tableHeader.
         * @method getTableHeader
         * @param {String} url 接口地址.
         */
    async getTableHeader(url) {
      const res = await this.getFormFilter(url);
      this.tableHeader = res.data;
      this.tableHeader.forEach((head) => {
        if (Object.keys(head).includes('url')) {
          this.defineHeader.jumpHeader.push(head);
        }
      });
      this.$forceUpdate();
    },
    /**
         * 解析查询条件.
         * @method dealCondition
         */
    dealCondition() {
      const conditionGroup = _.groupBy(this.filterConditon, 'type');
      const conditionKeys = Object.keys(conditionGroup);
      if (conditionKeys.includes('input')) {
        this.textContext.isShow = true;
        for (const item of conditionGroup.input) {
          this.textContext.data.push({
            name: item.label + '：', // 输入框前面名称
            span: 6, // 栅格宽度
            input: '', // 输入框初始化内容
            placeholder: '请输入' + item.label + '进行搜索', // 提示语
            inputDisable: false, // 是否禁用
            type: '', // input类型
            style: 'width:80%', // input宽度
            key: item.key
          });
        }
      }
      if (conditionKeys.includes('select')) {
        this.selectContext.isShow = true;
        for (const item of conditionGroup.select) {
          this.selectContext.data.push({
            value: '',
            name: item.label + '：',
            style: 'width:70%;',
            span: 5,
            options: item.options,
            key: item.key,
            columnId: item.columnId,
            parentColumnId: item.parentColumnId
          });
        }
      }
      if (conditionKeys.includes('date')) {
        this.datePickerContext.isShow = true;
        const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const startTime = moment(endTime).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'); // 默认时间

        for (const item of conditionGroup.date) {
          this.datePickerContext.data.push({
            time: [moment().startOf('day'), moment().endOf('day')], // 初始化时间
            type: 'datetimerange', // 时间控件类型
            rangeSeparator: '至',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            key: item.key,
            span: 9,
            datePickerValue: [startTime, endTime]
          });
        }
      }
    },
    /**
         * 解析select选项option条件
         * @method dealCondition
         * @param {Object} options 选择项.
         */
    dealOptions(options) {
      for (const item of this.filterConditon) {
        if (item.type === 'select') {
          item.options = _.find(options, o => o.key === item.key).options;
        }
      }
      this.dealCondition();
    },
    clickQuery() {
      if (this.pageInfo.isShow) {
        this.$refs.reportTable.handleCurrentChange(1);
      } else {
        this.queryTable();
      }
    },
    /**
         * 请求表格数据
         * @method queryTable
         *
         */
    async queryTable(info) {
      const url = this.reportFormInfo.tableDataUrl;
      let params = this.getConditionParams();
      if (this.pageInfo.isShow) {
        params = Object.assign(this.getConditionParams(), info);
      }
      const res = await this.getFormTableData({ url, data: params });
      this.tableinfo = res.data;
      this.pageInfo.totalCount = this.pageInfo.isShow ? res.totalCount : 0;
    },
    /**
         * 导出表格数据
         * @method exportTable
         *
         */
    exportTable(componentsName) {
      this.exportInfo.params = JSON.stringify(this.getConditionParams());
      this.$nextTick(function () {
        this.$refs.conditionHead.$refs[componentsName].submit();
      });
    },
    /**
         * 页数变化
         * @method getPageInfo
         *
         */
    getPageInfo(info) {
      this.queryTable(info);
    },
    /**
         * 接受子组件传递的值，下拉框值改变
         * @method getSelectChange
         * @param {Object} data
         */
    getSelectChange(selOption) {
      this.selectContext.data.forEach(async (item, index) => {
        if ((selOption.columnId === item.parentColumnId) && selOption.columnId !== undefined) { // 选中selOption，儿子改变
          const param = {
            columnId: item.columnId,
            parentColumnId: item.parentColumnId,
            value: selOption.value
          };
          const url = this.reportFormInfo.getChildSel;
          const data = await this.getFormTableData({ url, data: param });
          this.$set(this.selectContext.data[index], 'options', data.options);
          this.$set(this.selectContext.data[index], 'value', '');
        }
      });
    },
    /** $refs
         * 获取查询参数
         * @method getConditionParams
         * @return {Object} 查询参数.
         */
    getConditionParams() {
      const params = {};
      if (this.textContext.isShow) {
        for (const item of this.textContext.data) {
          params[item.key] = item.input;
        }
      }
      if (this.selectContext.isShow) {
        for (const item of this.selectContext.data) {
          params[item.key] = item.value;
        }
      }
      if (this.datePickerContext.isShow) {
        for (const item of this.datePickerContext.data) {
          params[item.key] = item.datePickerValue;
        }
      }
      return params;
    },
    /**
         * get请求
         * @method getFormFilter
         * @return {Object} 查询参数.
         */
    getFormFilter(url,
      params = {}) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          params
        }).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    /**
         * post请求
         * @method getFormTableData
         * @return {Object} 查询参数.
         */
    getFormTableData({
      url,
      data = {},
      params = {}
    }) {
      return new Promise((resolve, reject) => {
        axios({
          url,
          method: 'post',
          // 发送的数据
          data,
          // url参数
          params

        }).then((res) => {
          resolve(res.data);
        }).catch((error) => {
          reject(error);
        });
      });
    }
  },
  components: {
    selectInputExport,
    reportTable
  }
};
</script>

  <style lang="scss" scoped>
    .right-main {
      background: #e2e2e4;
      width: 100%;
      height: 100%;
      overflow: auto;

      .right-main__table {
        min-height: -moz-calc(100% - 110px);
        min-height: -webkit-calc(100% - 110px);
        min-height: calc(100% - 110px);
        margin: 25px;
        background: #fff;
        padding: 15px 21px;
        // position: relative;
      }
    }

    .table-cell__click {
      font-size: 12px;
      color: #1584BC;

      &:hover {
        cursor: pointer;
      }
    }
  </style>


  `
  },
  entryTemplate: `import Main from './main.vue'
export default Main`
}
