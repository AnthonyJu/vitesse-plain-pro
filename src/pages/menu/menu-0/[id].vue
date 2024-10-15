<template>
  <div class="flex-col layout-default">
    <h5>params</h5>
    <CodeBlock :code="JSON.stringify(route.params)" lang="json" />

    <h5>query</h5>
    <CodeBlock :code="JSON.stringify(route.query)" lang="json" />

    <h5>meta</h5>
    <CodeBlock :code="JSON.stringify(route.meta)" lang="json" />

    <h5>输入以测试路由缓存</h5>
    <el-input v-model="value" placeholder="请输入" />
  </div>
</template>

<script setup lang='ts'>
const route = useRoute('/menu/menu-0/[id]')
const value = ref('')
</script>
