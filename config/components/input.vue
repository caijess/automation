<template>
  <section class="page">
    <el-row>
      <el-col :span="4">
        <div class="key-name" v-text="name"></div>
      </el-col>
      <el-col :span="20">
        <el-input v-model.trim="input" :size="size" :placeholder="placeholder" :type="type" :clearable="
      clearable" :disabled="inputDisable" :style="style" :suffix-icon="suffixIcon" @blur="getInput">
    <template slot="prefix">
      <slot name="headSearch"></slot>
    </template>
    <template slot="suffix">
      <slot name="endSearch"></slot>
    </template>
    </el-input>
         </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import { input } from './mixin';

/**
   * input component description
   * @vuedoc
   * @exports component/input
   */
export default {
  name: 'inputs',
  props: {
    /**
       * 输入框的Value值
       */
    inputContext: {
      required: true,
      type: Object,
      default: () => ({
        input: '',
        placeholder: '请输入',
        inputDisable: false,
        suffixIcon: 'el-icon-search',
        type: ''
      })
    }
  },
  mixins: [input],
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  computed: {},
  methods: {
    /**
       * 向父组件传递输入框的当前Value值.
       * @method getInput
       */
    getInput() {
      this.inputContext.input = this.input;
      this.$emit('inputValue', this.input);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.key-name{
  text-align: left;
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 60px;
}
</style>
