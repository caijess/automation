export default {
  functional: true,
  render: (h, ctx) => ctx.scopedSlots.default && ctx.scopedSlots.default(ctx.props || {})
};
