<!-- 时间控件 todo:统一时间控件 -->
<template>
  <div class="date-picker" :class="classList">
    <el-row>
      <el-col :span="3">
        <div class="key-name" v-text="dateContext.name"></div>
      </el-col>
      <el-col :span="21">
        <el-date-picker :size="size" v-bind="$attrs" v-model="datePickValue" v-on="$listeners">
        </el-date-picker>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/**
   * @vuedoc
   * @exports component/datePickerComponent
   */
export default {
  name: 'datePickerComponent',
  props: {
    classList: {
      required: false,
      type: Array
    },
    /**
       * 值
       */
    dateContext: {
      required: false,
      type: Object,
      default: () => ({
        name: ''
      })

    }
  },
  data() {
    return {
      datePickValue: this.$attrs.value,
      size: 'medium'
    };
  },

  components: {}

  // computed: {},


  // methods: {}
};
</script>
<style lang='scss' scoped>
  .date-picker {
    .date-picker__prev {
      display: inline-block;
      font-size: 13px;
    }
  }
  .key-name{
  text-align: left;
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 60px;
}
</style>
