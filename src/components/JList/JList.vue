<template>
  <div full flex-col overflow-hidden>
    <JForm
      v-model:form="form"
      inline
      :loading="loading"
      :form-items="formOptions.formItems"
      :form-props="formOptions.formProps"
      @search="handleSearch"
    >
      <template v-for="{ prop } in formSlots" :key="prop" #[prop]="scope">
        <slot :name="prop" :row="scope.form" />
      </template>

      <template #toolbar>
        <slot name="toolbar" />
      </template>
    </JForm>

    <slot v-if="data.length" />
    <el-empty v-else />

    <JPagination
      v-model:current="current"
      v-model:size="size"
      :total="total"
      :loading="loading"
      v-bind="paginationOptions"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup lang='ts'>
import request from '@/utils/request'

interface Props {
  url: string
  formOptions: JDialogOptions
  paginationOptions?: JPaginationOptions
  dataFormator?: (data: any[]) => any[] // 数据处理函数
}

const props = defineProps<Props>()
const data = defineModel<any[]>('data', { default: [] })

const form = ref()
const current = ref(1)
const size = ref(15)
const total = ref(0)
const loading = ref(false)

// 计算需要自定义的表单插槽
const formSlots = computed(() => {
  return props.formOptions?.formItems.filter(v => v.type === 'slot')
})

// 检索表单函数
function handleSearch() {
  loading.value = true
  request({
    url: props.url,
    method: 'get',
    params: {
      ...form.value,
      current: current.value,
      size: size.value,
    },
  })
    .then((res) => {
      if (props.dataFormator) data.value = props.dataFormator(res.data.data.records)
      else data.value = res.data.data.records
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
