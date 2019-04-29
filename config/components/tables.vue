<template>
  <section class="table-page">
    <el-table :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)" :row-key="rowKey" :border='isBorder' style="width: 100%;font-size:12px;" v-loading="loading" id="tableData" v-bind="$attrs" v-on="$listeners">
      <template v-for="(item,key) in tableHeader">
        <el-table-column     :sortable="sortAble(getItemKey(item,key,'prop'))" :prop="getItemKey(item,key,'prop')" :label="getItemKey(item,key,'label')" :align="getItemKey(item,key,'align')" :width="getItemKey(item,key,'width')" :key="key" v-bind="isString(item)?null:item.attr" v-if="customize.includes(getItemKey(item,key,'prop'))" v-on="$listeners">
          <template slot-scope="scope" >
            <temp-var :prop="getItemKey(item,key,'prop')">
              <template v-slot="{prop}">
                <table-row :rowData= "scope" :customize="customize" :rowKey="prop" :class-name="isString(item)?null:item.class">
                  <template #[prop] v-if="customize.includes(prop)" v-sot="{prop}">
                    <slot :name="prop" :rowData="scope.row[prop]" :rows="scope.row"></slot>
                  </template>
                </table-row>
              </template>
            </temp-var>
          </template>
        </el-table-column>
        <el-table-column :type="getItemKey(item,key,'type')"   :sortable="sortAble(getItemKey(item,key,'prop'))" :prop="getItemKey(item,key,'prop')" :label="getItemKey(item,key,'label')" :align="getItemKey(item,key,'align')" :width="getItemKey(item,key,'width')" :key="key" v-bind="isString(item)?null:item.attr" v-else>
        </el-table-column>
      </template>
    </el-table>
    <div class="table-page__pagination">
      <el-pagination background :layout="pageLayout" :total="totalCount" :page-size="pageSize" :page-sizes="pageSizes" v-show="showPage && this.list.length!==0" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="currentPage" @prev-click="handlePrevClick" @next-click="handleNextClick">
      </el-pagination>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import { table } from './mixin';
import tempVar from './tempVar'; // 创建局域变量
import tableRow from './tableRow';


/**
   * table component description
   * @vuedoc
   * @exports component/tables
   */
export default {
  name: 'tables',
  props: {
    pagination: {
      required: false,
      type: Object,
      default: () => ({
        loading: false, // 伴随loading状态
        pageSize: 10, // 页长
        pageSizes: [10, 15, 20, 25, 30], // 页长数
        pageLayout: 'total, sizes, prev, pager, next, jumper'
      })
    },
    rowKey: {
      required: false,
      type: String
    },
    /**
     * 表格类型
     */
    type: {
      required: false,
      type: String,
      default: ''
    },
    /**
       * 应用名称
       */
    tableHeader: {
      required: true,
      type: [Object, Array],
      default: () => [
        {
          prop: 'name',
          label: '应用名称'
        },
        {
          prop: 'htmlDuration',
          label: 'HTML加载（s）'
        },
        {
          prop: 'completeDuration',
          label: '页面加载'
        },
        {
          prop: 'pvNumber',
          label: '页面PV数'
        },
        {
          prop: 'jsErrorNumber',
          label: 'JS错误率（%）'
        }
      ]
    },
    /**
       * 是否展示页码
       */
    showPage: {
      required: false,
      type: Boolean,
      default: false
    },
    /**
       * 表格显示的数据集合
       */
    list: {
      required: false,
      type: Array
    },
    /**
       * 是否对列进行排序
       */
    isSortable: {
      type: [Boolean, Array],
      required: false
    },
    /**
       * 是否显示边框
       */
    isBorder: {
      required: false,
      type: Boolean,
      default: true
    },
    totalCount: {
      required: false,
      type: Number,
      default: 0
    }
  },
  mixins: [table],
  data() {
    return {
      tableinfo: [],
      CellName: '',
      customize: []
    };
  },
  mounted() {
    console.log(1);
    this.customize = Object.keys(this.$scopedSlots);
  },
  computed: {},
  watch: {
  },
  methods: {
    /**
       * 判断表格中的哪些列需要排序.
       * @method sortAble
       * @param {Boolean} key - Boolean类型的值，true为全部排序，false为全不排序.
       * @param {Array} key - Array类型的值，需要排序的列的key写入Array.
       * @return {Boolean}  一个Boolean类型的值，true为此列需要排序，false为不需要排序.
       */
    sortAble(key) {
      // if (this.isSortable === false) {
      //   return false;
      // }
      // if (this.isSortable === true) {
      //   return true;
      // }
      // if (this.isSortable && this.isSortable.length !== 0) {
      //   return this.isSortable.includes(key);
      // }
      // return true;
      if (typeof (this.isSortable) === 'boolean') {
        return this.isSortable;
      } else if (this.isSortable && this.isSortable.length !== 0) {
        return this.isSortable.includes(key);
      }
      return true;
    },
    /**
       * 判断是参数是否是字符串
       * @param {Object} str 判断是否是对象的参数
       * @param {String} str 判断是否是字符串的参数
       * @method isString
       */
    isString(str) {
      return typeof (str) === 'string';
    },
    /**
       * 根据item 判断此时的key是对象中的prop还是key
       * @param {Object} item 判断是否是对象的参数
       * @param {String} item 判断是否是字符串的参数
       * @param {String} key 若是字符串 则返回 Key值作为表格连接参数
       */
    getItemKey(item, key, attr) {
      return this.isString(item) ? key : item[attr];
    }
  },
  components: {
    tableRow,
    tempVar
  }

};
</script>

<style scoped lang="scss">
@mixin center($width,$height){
  width: $width;
  height: $height;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -($height) / 2;
  margin-left: -($width) / 2;
}
  /deep/ .el-table {
    thead {
      color: #333;
      font-size: 12px;
      font-weight: bolder;
      .cell {
        font-weight: bolder;
      }
    }
  }
  .table-page {
    .pagination {
      color: #666;
    }

    .test {
      @include center(100px, 100px);
      width: 100px;
      height: 100px;

    }
  }

  .lastCell {
    color: #1584bc;
    cursor: pointer;
    font-size: 11px;
  }

  .firstCell {
    color: #1584bc;
    cursor: pointer;
  }

  .table-page__pagination {
      width: 100%;
  text-align: center;
  margin: 30px 0 20px 0;
  }
</style>
