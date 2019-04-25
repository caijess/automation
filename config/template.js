// template.js
module.exports = {
  vueTemplate:(opts={}) => {
    console.log(opts);
    return `<template>
  <div class="${opts.fileName}">
    ${opts.fileName}组件
  </div>
</template>
<script>
export default {
  name: '${opts.fileName}'
}
</script>
<style lang="scss" scoped>
.${opts.fileName} {

}
</style>
`
  },
  entryTemplate: `import Main from './main.vue'
export default Main`
}
