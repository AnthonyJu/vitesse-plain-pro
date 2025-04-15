<template>
  <div full flex-col overflow-hidden>
    <!-- 检索表单 -->
    <JForm
      v-if="formOptions"
      ref="formRef"
      v-model:form="searchForm"
      inline
      :loading="loading"
      :form-items="formOptions.formItems"
      :form-props="formOptions.formProps"
      @search="handleSearch"
    >
      <template v-for="{ prop } in formSlots" :key="prop" #[prop]="scope">
        <!-- form slot前缀 -->
        <slot :name="`form-${prop}`" :form="scope.form" />
      </template>

      <template v-if="!!API.create || $slots.toolbar" #toolbar>
        <el-button v-if="!!API.create" type="primary" @click="createFn()">新增</el-button>
        <slot name="toolbar" />
      </template>
    </JForm>

    <!-- 表格数据 -->
    <div full flex-col overflow-hidden>
      <!-- type 为 table 时 -->
      <JTable
        v-if="type === 'table'"
        ref="tableRef"
        v-loading="loading"
        flex-1
        :data="tableData"
        :columns="tableOptions!.columns"
        :table-props="tableOptions!.tableProps"
      >
        <template
          v-for="{ prop } in tableSlots!"
          :key="prop"
          #[prop]="scope"
        >
          <slot :name="prop!" :row="scope.row" />

          <template v-if="(!!API.update || !!API.delete) && prop === 'control'">
            <el-button
              v-if="!!API.update"
              type="primary"
              link
              @click="updateFn(scope.row)"
            >
              修改
            </el-button>
            <el-popconfirm
              v-if="!!API.delete"
              title="确定要删除吗?"
              @confirm="deleteFn(scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </template>
      </JTable>

      <!-- type 为 list 时 -->
      <el-scrollbar v-else v-loading="loading">
        <slot />
        <el-empty v-if="tableData.length === 0" />
      </el-scrollbar>

      <!-- 分页 -->
      <JPagination
        v-if="pagination"
        v-model:current="current"
        v-model:size="size"
        :loading="loading"
        :total="total"
        v-bind="paginationOptions"
        @handle-search="handleSearch"
      />
    </div>

    <!-- 弹窗 -->
    <JDialog
      v-if="dialogOptions"
      ref="dialogRef"
      v-model:visible="visible"
      v-model:form="dialogForm"
      :title="title"
      :loading="dialogLoading"
      :form-items="dialogOptions.formItems"
      :form-props="dialogOptions.formProps"
      :dialog-props="dialogOptions.dialogProps"
      @on-submit="dialogSubmit"
    >
      <template v-for="{ prop } in dialogSlots" :key="prop" #[prop]="scope">
        <!-- dialog slot前缀 -->
        <slot :name="`dialog-${prop}`" :form="scope.form" />
      </template>
    </JDialog>
  </div>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import { generateForm, JLoading } from './j-tools'

interface UrlObject {
  get: string
  create?: string
  update?: string
  delete?: string
}
interface Props {
  url: string | UrlObject
  type?: 'table' | 'list'
  pagination?: boolean // 是否需要分页
  defaultSearchParams?: Record<string, any> // 默认搜索条件
  tableFormator?: (data: any[]) => any[] // 返回数据处理函数
  dialogFormator?: (data: Record<string, any>) => Record<string, any> // 弹窗表单数据处理
  formDataFormatter?: (data: Record<string, any>) => Record<string, any> // 搜索表单数据处理
  formOptions?: JFormOptions // 搜索表单配置项
  tableOptions?: JTableOptions // 表格配置项
  dialogOptions?: JDialogOptions // 弹窗配置项
  paginationOptions?: JPaginationOptions // 分页配置项
}
interface Api {
  get: (params?: any) => Promise<Res<any>>
  create?: (data: any) => Promise<Res<any>>
  update?: (data: any) => Promise<Res<any>>
  delete?: (id: string | number) => Promise<Res<any>>
}

const {
  type = 'table',
  pagination = true,
  defaultSearchParams = {},
  ...props
} = defineProps<Props>()
const emit = defineEmits(['onOriginDataChange']) // 原始数据变化会触发（例如增删改）
const slots = defineSlots()

// 请求接口定义
const API: Api = {
  get: (params?: any) => request({
    url: typeof props.url === 'object' ? props.url.get : props.url,
    method: 'get',
    params,
  }),
}

// 若url为对象，则分别定义create、update、delete方法
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
  return props.formOptions?.formItems.filter(v => v.type === 'slot')
})

// 计算需要自定义的表格插槽
const tableSlots = computed(() => {
  return props.tableOptions?.columns.filter((v) => {
    if (v.prop === 'control') return !!(!!API.update || !!API.delete || slots.control)
    return v.slot
  })
})

// 计算需要自定义的弹窗插槽
const dialogSlots = computed(() => {
  return props.dialogOptions?.formItems.filter(v => v.type === 'slot')
})

// 表格相关
const current = ref(1)
const size = ref(15)
const total = ref(0)
const loading = ref(false)
const tableData = defineModel<any[]>('data', { default: [] })

// 检索表单数据
const searchForm = ref<Record<string, any>>({})

// 检索表单函数
function handleSearch(val?: any) {
  loading.value = true

  // val 存在代表是表单检索,需要从第一页开始
  if (val) current.value = 1

  // 切断与原表单联系，防止表单数据被修改
  const formattedData = props.formDataFormatter?.(searchForm.value) || searchForm.value
  const data = JSON.parse(JSON.stringify(formattedData))
  delete data[DATE_TIME_RANGE]

  // tips 根据是否有分页，来决定是否传入分页参数，若0不支持，则根据具体后台情况来决定入参
  API.get({
    ...data,
    ...defaultSearchParams,
    current: current.value,
    size: !pagination ? 0 : size.value,
  })
    .then((res: any) => {
      const result = res.data.data.records
      tableData.value = props.tableFormator?.(result) || result
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
const initDialogForm = props.dialogOptions && generateForm(props.dialogOptions.formItems)

// 弹窗新增
function createFn() {
  title.value = '新增'
  visible.value = true
  dialogForm.value = initDialogForm!
}

// 弹窗编辑
function updateFn(row: Record<string, any>) {
  title.value = '编辑'
  visible.value = true
  dialogForm.value = JSON.parse(JSON.stringify(row))
}

// 弹窗删除
function deleteFn(id: string) {
  const message = ElMessage({
    message: 'loading...',
    icon: JLoading,
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

// 弹窗提交
function dialogSubmit() {
  dialogLoading.value = true
  const data = props.dialogFormator?.(dialogForm.value) || dialogForm.value
  if (data.id) {
    API.update!(data)
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
    API.create!(data!)
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

// 若表单不存在，则直接请求数据，否则数据请求将在表单检组件中触发
onMounted(() => {
  if (!props.formOptions) handleSearch()
})

const formRef = ref()
const tableRef = ref()
const dialogRef = ref()

// 暴露给父组件的方法
defineExpose({ formRef, tableRef, dialogRef, searchForm, dialogForm, createFn, updateFn, deleteFn, handleSearch })
</script>
