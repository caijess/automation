<template>
  <section class="filter-head">
    <el-row class="filter-head__row">
      <template v-if="textContext.isShow">
        <el-col v-for="text in textContext.data" :key="text.index" :span="text.span">
          <text-input class="filter-head__text" :inputContext='text' @inputValue="inputValue"></text-input>
        </el-col>
      </template>
      <template v-if="selectContext.isShow">
        <el-col v-for="select in selectContext.data" :key="select.index" :span="select.span">
          <select-input class="filter-head__select" :selectContext="select" @getSelectChange='getSelectChange(select)'></select-input>
        </el-col>
      </template>
      <template v-if="datePickerContext.isShow">
        <el-col v-for="datePick in datePickerContext.data" :key="datePick.index" :span='datePick.span'>
          <date-picker class='filter-head__datePicker' v-model="datePick.datePickerValue" :type="datePick.type" :range-separator="datePick.rangeSeparator" :start-placeholder="datePick.startPlaceholder" :end-placeholder="datePick.endPlaceholder" align="right" @change="changeTime" value-format="yyyy-MM-dd HH:mm:ss">
          </date-picker>
        </el-col>
      </template>
      <template>
        <el-col :span="2">
          <el-button class="ml" type="primary" size="small" @click="query">查询</el-button>
        </el-col>
        <el-col :span="2" v-if="exportInfo.isShow">
          <el-button class="ml" type="primary" size="small" @click=exportTable>导出</el-button>
        </el-col>
      </template>
    </el-row>
     <form ref="formReport" :action="exportInfo.url" method="post" target="newWin" v-show="false">
      <el-input name="paramStr" v-model="exportInfo.params"></el-input>
    </form>
  </section>

</template>
<script>
import textInput from './input';
import selectInput from './selects';
import datePicker from './datePickers';

export default {
  name: 'conditionHead',
  props: {
    /**
       * input输入框对象，包括data、isShowText等属性
       */
    textContext: {
      type: Object,
      default: () => ({
        isShowText: false
      })
    },
    /**
       * select选择框对象，包括data、isShowSelect等属性
       */
    selectContext: {
      type: Object,
      default: () => ({
        isShowSelect: false
      })
    },
    /**
       * datePicker日期选择框对象，包括data、isShowDate等属性
       */
    datePickerContext: {
      type: Object,
      default: () => ({
        isShowDate: false
      })
    },

    /**
       * datePicker日期选择框对象，包括data、isShowDate等属性
       */
    exportInfo: {
      type: Object,
      default: () => ({
        isShow: false
      })
    }
  },
  data() {
    return {
      isTime: true,
      selectTime: {
        startTime: null,
        endTime: null
      },
      datePickerValue: []
    };
  },
  // watch: {
  //   selectContext: {
  //     handler(curVal) {
  //       // this.$set(this.selectContext, 'options', curVal.options);
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    /**
       * 接受子组件传递的值，下拉框值改变
       * @method getSelectChange
       * @param {Object} data
       */
    getSelectChange(data) {
      this.$emit('getSelectChange', data);
    },
    getDateTime(value) {
      this.selectTime.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      switch (value) {
        case '30min':
          this.selectTime.startTime = moment(this.selectTime.endTime).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
          this.isTime = true;
          break;
        case '1hour':
          this.selectTime.startTime = moment(this.selectTime.endTime).subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
          this.isTime = true;
          break;
        case '6hour':
          this.selectTime.startTime = moment(this.selectTime.endTime).subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss');
          this.isTime = true;
          break;
        case '12hour':
          this.selectTime.startTime = moment(this.selectTime.endTime).subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss');
          this.isTime = true;
          break;
        case '1day':
          this.selectTime.startTime = moment(this.selectTime.endTime).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss');
          this.isTime = true;
          break;
        default:
          this.isTime = false;
      }
    },
    changeTime(value) {
      
      this.$emit('getSelectChange', { startTime: value!=null?value[0]:"", endTime:  value!=null?value[1]:"" });
    },
    query() {
      this.$emit('query');
    },
    exportTable() {
      this.$emit('exportTable', 'formReport');
    },
    inputValue(data) {
      this.$emit('inputValue', data);
    }
  },
  mounted() {

  },

  components: {
    textInput,
    selectInput,
    datePicker
  }
};
</script>
<style scoped lang="scss">

  .filter-head {
    height: 60px;
    line-height: 60px;
    .filter-head__row {
      background-color: #fff;
      padding: 0 25px;
      .el-col {
        padding-right: 20px;
      }
    }
    .filter-head__text, .filter-head__select, .filter-head__datePicker {
      /deep/ span {
        font-size: 13px;
      }
    }
    .filter-head__datePicker {
      text-align: left;
    }
  }
</style>
