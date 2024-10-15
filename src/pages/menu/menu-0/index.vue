<template>
  <div class="layout-default">
    <h5>所有用户可查看</h5>
    <div w-300px flex-col gap-16px>
      <el-input v-model="id" placeholder="请输入详情页id" />
      <el-input v-model="tagName" placeholder="请输入详情页名称" />
      <el-button type="primary" @click="go">前往</el-button>
    </div>
  </div>
</template>

<script setup>
const id = ref('')
const tagName = ref('')
const router = useRouter()
function go() {
  router.push(`/menu/menu-0/${id.value}?${QUERY_TAG_NAME}=${tagName.value}`)
}
</script>
