<template>
  <div class="layout-default">
    <h5>所有用户可查看</h5>
    <el-input v-model="value" placeholder="请输入详情页id" />
    <el-button type="primary" @click="go">前往</el-button>
  </div>
</template>

<script setup>
const value = ref('')
const router = useRouter()
function go() {
  router.push(`/menu/menu-0/${value.value}?show-name=名字`)
}
</script>
