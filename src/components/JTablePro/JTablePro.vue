<template>
  <div full flex-col>
    <!-- 检索表单 -->
    <JForm
      v-if="formOptions"
      :form-props="formOptions.formProps"
      :render-forms="formOptions.renderForms"
      :rules="formOptions.rules"
      :is-search="true"
      :loading="loading"
      @search="handleSearch"
    >
      <template v-for="{ prop } in formSlots" :key="prop" #[prop]="scope">
        <slot :name="prop" :row="scope.form" />
      </template>

      <template #toolbar>
        <el-button v-if="isCrud" type="primary" @click="addFn()">新增</el-button>
        <slot name="toolbar" />
      </template>
    </JForm>

    <!-- 表格数据 -->
    <JTable
      v-if="tableOptions"
      v-loading="loading"
      :data="data"
      :columns="tableOptions.columns"
      :table-props="tableOptions.tableProps"
    >
      <template
        v-for="{ prop } in tableSlots!.filter((v) => v.prop !== 'control')"
        :key="prop"
        #[prop]="scope"
      >
        <slot :name="prop" :row="scope.row" />
      </template>

      <template v-if="isCrud || tableSlots!.find((v) => v.prop === 'control')" #control="scope">
        <slot name="control" :row="scope.row" />

        <el-button type="primary" link @click="editFn(scope.row)">修改</el-button>
        <el-popconfirm title="确定要删除吗?" @confirm="deleteFn(scope.row.id)">
          <template #reference>
            <el-button type="primary" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </JTable>

    <!-- 分页 -->
    <JPagination
      v-if="!noPagenation"
      v-model:current="current"
      v-model:size="size"
      :loading="loading"
      :total="total"
      @handle-search="handleSearch"
    />

    <!-- 弹窗 -->
    <JDialog
      v-if="dialogOptions"
      v-model:visible="visible"
      v-model:form="dialogForm"
      :title="title"
      :loading="dialogLoading"
      :form-options="dialogOptions.formOption"
      :dialog-props="dialogOptions.dialogProps"
      @on-submit="dialogSubmit"
      @on-closed="initDialogForm"
    >
      <template v-for="{ prop } in dialogSlots" :key="prop" #[prop]="scope">
        <!-- TODO: dialog slot前缀 -->
        <slot :name="`dialog-${prop}`" :row="scope.form" />
      </template>
    </JDialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { AxiosResponse } from 'axios'
import request from '@/utils/request'

interface UrlObject {
  get: string
  create?: string
  update?: string
  delete?: string
}
interface Props {
  url: string | UrlObject
  noPagenation?: boolean // 是否不需要分页
  dataFormator?: (data: any[]) => any[] // 数据格式化
  formOptions?: JFormOptions
  tableOptions?: JTableOptions<any>
  dialogOptions?: JDialogOptions
}
interface Api {
  get: (params?: any) => Promise<AxiosResponse>
  create?: (data: any) => Promise<AxiosResponse>
  update?: (data: any) => Promise<AxiosResponse>
  delete?: (id: string | number) => Promise<AxiosResponse>
}

const props = defineProps<Props>()
const emit = defineEmits(['onOriginDataChange']) // 原始数据变化会触发（例如增删改）

// TODO: 通过props传入url，url可以是对象，也可以是字符串，如果是对象，那么就是增删改查
const isCrud = computed(() => typeof props.url === 'object')
const API: Api = {
  get: (params?: any) => request({
    url: typeof props.url === 'object' ? props.url.get : props.url,
    method: 'get',
    params,
  }),
}

if (typeof props.url === 'object') {
  if (props.url.create) {
    API.create = (data: any) => request({
      url: (props.url as UrlObject).create,
      method: 'post',
      data,
    })
  }
  if (props.url.update) {
    API.update = (data: any) => request({
      url: (props.url as UrlObject).update,
      method: 'post',
      data,
    })
  }
  if (props.url.delete) {
    API.delete = (id: string | number) => request({
      url: (props.url as UrlObject).delete,
      method: 'get',
      params: { id },
    })
  }
}

// 计算需要自定义的表单插槽
const formSlots = computed(() => {
  return props.formOptions?.renderForms.filter(v => v.type === 'slot')
})

// 计算需要自定义的表格插槽
const tableSlots = computed(() => {
  return props.tableOptions?.columns.filter(v => v.slot)
})

// 计算需要自定义的弹窗插槽
const dialogSlots = computed(() => {
  return props.dialogOptions?.formOption.renderForms.filter(v => v.type === 'slot')
})

// 表格相关
const current = ref(1)
const size = ref(15)
const total = ref(0)
const loading = ref(false)
const data = ref<any[]>([])

// 检索表单函数
async function handleSearch(page: number = current.value, params: Record<string, any> = {}) {
  loading.value = true
  const form = JSON.parse(JSON.stringify(params))
  for (const key in form) form[key] = form[key].toString()

  // TODO：根据是否有分页，来决定是否传入分页参数，若0不支持，则根据具体情况来决定入参
  const limit = props.noPagenation ? 0 : size.value
  API.get({ ...form, current: page, size: limit })
    .then((res: any) => {
      if (props.dataFormator) data.value = props.dataFormator(res.data.data.records)
      else data.value = res.data.data.records
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

// 定义弹窗
const title = ref('')
const visible = ref(false)
const dialogLoading = ref(false)
const dialogForm = ref<Record<string, any>>({})

// 若是有弹窗，则初始化弹窗表单
if (props.dialogOptions) initDialogForm()
function initDialogForm() {
  const form: Record<string, any> = {}
  // TODO:新增value初始值
  props.dialogOptions!.formOption.renderForms.forEach((item) => {
    form[item.prop] = item.value ?? ''
  })
  dialogForm.value = form
}

function addFn() {
  title.value = '新增'
  visible.value = true
}
function editFn(row: Record<string, any>) {
  title.value = '编辑'
  dialogForm.value = JSON.parse(JSON.stringify(row))
  visible.value = true
}
function deleteFn(id: string) {
  const message = ElMessage({
    message: 'loading...',
    // TODO: loading图标
    icon: 'el-icon-loading',
    duration: 0,
  })
  API.delete!(id)
    .then(() => {
      ElMessage.success('删除成功')
      handleSearch()
      emit('onOriginDataChange', 'delete')
    })
    .finally(() => {
      message.close()
    })
}
function dialogSubmit() {
  dialogLoading.value = true
  if (dialogForm.value?.id) {
    API.update!(dialogForm.value)
      .then(() => {
        visible.value = false
        ElMessage.success('修改成功')
        handleSearch()
        emit('onOriginDataChange', 'update')
      })
      .finally(() => {
        dialogLoading.value = false
      })
  }
  else {
    API.create!(dialogForm.value!)
      .then(() => {
        visible.value = false
        ElMessage.success('新增成功')
        handleSearch()
        emit('onOriginDataChange', 'create')
      })
      .finally(() => {
        dialogLoading.value = false
      })
  }
}

// 若表单不存在，则直接请求数据，否则数据请求将在表单检组建中触发
onMounted(() => {
  if (!props.formOptions) handleSearch()
})

// 暴露给父组件的方法
defineExpose({ dialogForm, addFn, data })
</script>
