<!-- <template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit($event, '测试')"
        >Query</el-button
      >
    </el-form-item>
  </el-form>
</template> -->

<script lang="ts">
import { reactive, resolveComponent, h, defineComponent } from 'vue'

export default defineComponent(
  (props: { p1: string }, other) => {
    const formInline = reactive({
      user: '',
      region: '',
      date: '',
    })
    formInline.user = props.p1
    const onSubmit = (event, arg) => {
      console.log('submit!', event, arg, formInline)
      emits('sub', event, arg, formInline)
      console.log('submit!', event, arg, JSON.stringify(formInline))
    }

    return () => {
      const pp = {
        modelValue: formInline.user,
        'onUpdate:modelValue': $event => {
          debugger
          formInline.user = $event
        },
        placeholder: 'Approved by',
        clearable: true,
      }
      return h(
        resolveComponent('el-form'),
        { inline: true, model: formInline, class: 'demo-form-inline' },
        () => [
          h(resolveComponent('el-form-item'), { label: 'Approved by' }, () => [
            h(resolveComponent('el-input'), pp),
          ]),
        ],
      )
    }
  },
  {
    props: ['p1'],
    emits: ['sub'],
  },
)

// defineExpose({
//   formInline,
// })
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
