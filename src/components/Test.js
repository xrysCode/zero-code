export const testData = {
  type: ComponentType.card,
  tagName: 'el-from',
  props: {
    ':inline': 'true',
    ':model': 'formInline',
    class: 'demo-form-inline',
  },
  children: {
    default: [
      {
        tagName: 'el-form-item',
        props: { label: 'Approved by' },
        children: {
          default: {
            tagName: 'el-input',
            props: {
              'v-model': 'formInline.user',
              placeholder: 'Approved by',
              clearable: true,
            },
            children: { default: [] },
          },
        },
      },
    ], // 封装这种函数的写法 转换为下面这种  这种结构导致方法执行失败，需要找一直直接得到对象的方式
  },
  context: {
    reactive: {
      user: '',
      region: '',
      date: '',
    },
    onSubmit: () => {
      console.log('submit!')
    },
  },
  interceptFlag: true,
}
