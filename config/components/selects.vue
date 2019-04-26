<template>
  <section class="page">
    <span v-text="name"></span>
    <el-select v-model="value" placeholder="请选择" :size="size" :disabled="disabled" :clearable="clearable" :style="style" :multiple="multiple" @change='getSelectChange'>
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
      </el-option>
    </el-select>
  </section>
</template>

<script type="text/ecmascript-6">
import selects from '@/mixins/selects';

/**
 * selector component description
 * @vuedoc
 * @exports component/selector
 */
export default {
  // props: ['selectContext'],
  name: 'selector',
  props: {
    /**
     * 下拉框的value值
     */
    selectContext: {
      required: true,
      type: Object,
      default: () => ({
        value: '',
        options: []
      })

    }
  },
  mixins: [selects],
  data() {
    return {

    };
  },
  components: {

  },
  methods: {
    getSelectChange(data) {
      this.selectContext.value = data;
      this.$emit('getSelectChange', data);
    }
  }

};
</script>

<style scoped lang="scss">
</style>
