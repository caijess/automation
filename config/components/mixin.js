
export const table = {
  data() {
    return {
      // 这些东西我们在list中处理，就不需要在每个页面再去手动的做这个了。
      loading: false, // 伴随loading状态
      currentPage: 1, // 页码
      pageSize: 10, // 页长
      pageSizes: [10, 15, 20, 25, 30], // 页长数
      pageLayout: 'total, sizes, prev, pager, next, jumper' // 分页布局
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loading = this.pagination.loading || this.loading;
      this.currentPage = this.pagination.currentPage || this.currentPage;
      this.pageSize = this.pagination.pageSize || this.pageSize;
      this.pageSizes = this.pagination.pageSizes || this.pageSizes;
      this.pageLayout = this.pagination.pageLayout || this.pageLayout;
    },
    // 分页回调事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.$emit('getPages', { currentPage: this.currentPage, pageSize: this.pageSize });
      // todo
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      // todo
      this.$emit('getPages', { currentPage: this.currentPage, pageSize: this.pageSize });
    },
    handlePrevClick(val) {
      this.currentPage = val;
      this.$emit('getPages', { currentPage: this.currentPage, pageSize: this.pageSize });
    },
    handleNextClick(val) {
      this.currentPage = val;
      this.$emit('getPages', { currentPage: this.currentPage, pageSize: this.pageSize });
    },
    transformToTreeFormat(data) { // 树形表格数据格式转换
      let i;
      let l;
      const result = [];
      const tmpMap = {};
      for (i = 0, l = data.length; i < l; i++) {
        tmpMap[data[i].id] = data[i];
      }
      for (i = 0, l = data.length; i < l; i++) {
        const p = tmpMap[data[i].parentId];
        if (p && data[i].id !== data[i].parentId) {
          let children = this.dataChildren(p);
          if (!children) {
            children = this.dataChildren(p, []);
          }
          children.push(data[i]);
        } else {
          result.push(data[i]);
        }
      }
      return result;
    },
    dataChildren(data, newChildren) {
      if (typeof newChildren !== 'undefined') {
        data.children = newChildren;
      }
      return data.children;
    }
    // /**
    //  * 表格数据请求成功的回调 处理完公共的部分（分页，loading取消）之后把控制权交给页面
    //  * @param {*} apiResult
    //  * @param {''} keyWord
    //  * @returns {*} promise
    //  */
    // listSuccessCb(apiResult = []) {
    //   return new Promise((reslove, reject) => {
    //     try {
    //       this.loading = false;
    //       // todo
    //       // 直接抛出
    //       this.totalCount = apiResult.length;
    //       reslove(this.list);
    //     } catch (error) {
    //       reject(error);
    //     }
    //   });
    // },
    // /**
    //  * 处理异常情况
    //  * ==> 简单处理  仅仅是对表格处理为空以及取消loading
    //  */
    // listExceptionCb() {
    //   this.loading = false;
    //   // console.error(error);
    // }
  },
  created() {
    // 这个生命周期是在使用组件的生命周期之前
    this.$nextTick().then(() => {
      this.$emit('getPages', { currentPage: this.currentPage, pageSize: this.pageSize, type: this.type });
    });
  }
};

export const selects = {
  data() {
    return {
      value: '',
      options: '',
      placeholder: '请选择', // 占位符
      clearable: false, // 可清空单选
      style: {

      }, // 添加样式
      multiple: false, // 是否多选
      disabled: false, // 禁用状态
      filterable: false, // 是否可搜索
      name: '下拉框', // 下拉框前面名称
      size: 'medium' // 大小
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.value = this.selectContext.value;
      this.options = this.selectContext.options;
      this.placeholder = this.selectContext.placeholder;
      this.clearable = this.selectContext.clearable;
      this.style = this.selectContext.style;
      this.multiple = this.selectContext.multiple;
      this.disabled = this.selectContext.disabled;
      this.filterable = this.selectContext.filterable;
      this.name = this.selectContext.name;
      this.size = this.selectContext.size || this.size;
    },
    getSelectChange(data) {
      this.$emit('getSelectChange', data);
    }
  }
};

export const input = {
  data() {
    return {
      name: '文本输入框',
      input: '',
      type: '', // 类型
      placeholder: '请输入查询条件', // 占位符
      clearable: true, // 可清空单选
      size: 'medium', // 输入框尺寸
      inputDisable: false,
      suffixIcon: 'el-icon-search',
      showPwd: true, // 是否显示密码
      style: {

      } // 添加样式
    };
  },
  mounted() {
    this.init();
  },
  computed: {
  },
  methods: {
    getTrim() {
      return this.trim ? this.input.replace(/^\s+|\s+$/gm, '') : this.input;
    },
    init() {
      this.input = this.inputContext.input;
      this.size = this.inputContext.size || this.size;
      this.placeholder = this.inputContext.placeholder;
      this.type = this.inputContext.type;
      this.clearable = this.inputContext.clearable || this.clearable;
      this.inputDisable = this.inputContext.inputDisable;
      this.trim = this.inputContext.trim;
      this.showPwd = this.inputContext.showPwd;
      this.name = this.inputContext.name;
      this.style = this.inputContext.style;
      this.suffixIcon = this.inputContext.suffixIcon || this.suffixIcon;
    }
  }
};

