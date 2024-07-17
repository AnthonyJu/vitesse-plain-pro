<template>
  <div full flex-col overflow-hidden>
    <!-- 检索表单 -->
    <JForm
      v-if="formOptions"
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
        <el-button v-if="!!API.create" type="primary" @click="createFn()">新增</el-button>
        <slot name="toolbar" />
      </template>
    </JForm>

    <div full flex-col overflow-hidden>
      <!-- 表格数据 -->
      <JTable
        v-loading="loading"
        flex-1
        :data="tableData"
        :columns="tableOptions.columns"
        :table-props="tableOptions.tableProps"
      >
        <template
          v-for="{ prop } in tableSlots"
          :key="prop"
          #[prop]="scope"
        >
          <slot :name="prop" :row="scope.row" />

          <template v-if="prop === 'control'">
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

      <!-- 分页 -->
      <JPagination
        v-if="!noPagenation"
        v-model:current="current"
        v-model:size="size"
        :loading="loading"
        :total="total"
        @handle-search="handleSearch"
      />
    </div>

    <!-- 弹窗 -->
    <JDialog
      v-if="dialogOptions"
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
        <!-- 注意: dialog slot前缀 -->
        <slot :name="`dialog-${prop}`" :row="scope.form" />
      </template>
    </JDialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
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
  dataFormator?: (data: any[]) => any[] // 数据处理函数
  formOptions?: JFormOptions
  tableOptions: JTableOptions
  dialogOptions?: JDialogOptions
}
interface Api {
  get: (params?: any) => Promise<Res<any>>
  create?: (data: any) => Promise<Res<any>>
  update?: (data: any) => Promise<Res<any>>
  delete?: (id: string | number) => Promise<Res<any>>
}

const props = defineProps<Props>()
const emit = defineEmits(['onOriginDataChange']) // 原始数据变化会触发（例如增删改）

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
  return props.formOptions?.formItems.filter(v => v.type === 'slot')
})

// 计算需要自定义的表格插槽
const tableSlots = computed(() => {
  return props.tableOptions?.columns.filter(v => v.slot)
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

const form = ref<Record<string, any>>({})

// 检索表单函数
function handleSearch(val?: any) {
  loading.value = true
  if (val) current.value = 1
  // TODO：根据是否有分页，来决定是否传入分页参数，若0不支持，则根据具体情况来决定入参
  API.get({ ...form.value, current: current.value, size: props.noPagenation ? 0 : size.value })
    .then((res: any) => {
      if (props.dataFormator) tableData.value = props.dataFormator(res.data.records)
      else tableData.value = res.data.data.records
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

function createFn() {
  title.value = '新增'
  visible.value = true
  dialogForm.value = initDialogForm
}

function updateFn(row: Record<string, any>) {
  title.value = '编辑'
  visible.value = true
  dialogForm.value = JSON.parse(JSON.stringify(row))
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

// 若表单不存在，则直接请求数据，否则数据请求将在表单检组件中触发
onMounted(() => {
  if (!props.formOptions) handleSearch()
})

// 暴露给父组件的方法
defineExpose({ form, dialogForm, createFn, updateFn, deleteFn, handleSearch })
</script>
