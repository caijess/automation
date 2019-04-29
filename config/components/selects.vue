<template>
  <section class="page">
     <el-row>
      <el-col :span="4">
        <div class="key-name" v-text="name"></div>
      </el-col>
      <el-col :span="20">
    <el-select v-model="selectContext.value" placeholder="请选择" :size="size" :disabled="disabled" :clearable="clearable" :style="style" :multiple="multiple" @change='getSelectChange'>
      <el-option v-for="item in selectContext.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
      </el-option>
    </el-select>
    </el-col>
    </el-row>
  </section>
</template>

<script type="text/ecmascript-6">
import { selects } from './mixin';

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
.key-name{
  text-align: left;
  overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 60px;
}
</style>
