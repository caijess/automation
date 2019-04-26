export default {
  functional: true,
  props: {
    customize: {
      type: Array,
      require: false
    },
    rowData: {
      type: Object,
      require: false
    },
    rowKey: {
      type: String,
      require: false
    },
    className: {
      type: [String, Array, Object],
      require: false
    }
  },
  render: (createElement, ctx) => {
    const customize = ctx.props.customize;
    // const rowData = ctx.props.rowData.row;
    const rowkey = ctx.props.rowKey;
    let elem;
    if (customize.includes(rowkey)) {
      elem = createElement('div', ctx.scopedSlots[rowkey]());
    }
    return elem;
  }
};
