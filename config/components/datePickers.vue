<!-- 时间控件 todo:统一时间控件 -->
<template>
  <div class="date-picker" :class="classList">
    <!-- <div class="date-picker__prev">
      <slot name="prev"></slot>
    </div> -->
    <el-date-picker :size="size" v-bind="$attrs" v-model="datePickValue"
    v-on="$listeners"
    >
    </el-date-picker>
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
  .date-picker{
    .date-picker__prev{
      display:inline-block;
      font-size:13px;
    }
  }
</style>
