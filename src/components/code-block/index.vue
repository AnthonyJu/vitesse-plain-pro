<template>
  <div class="code-block">
    <div ref="refVal" />
    <div class="code-language">{{ lang }}</div>
    <div
      v-if="isSupported" class="code-copy"
      @click="copyFn"
    >
      <Iconify class="icon" icon="carbon:copy" />
    </div>
  </div>
</template>

<script setup lang='ts'>
const { code, lang } = defineProps<{
  code: string
  lang: string
}>()

const refVal = ref<HTMLElement>()

const { copy, isSupported } = useClipboard()
function copyFn() {
  copy(code)
    .then(() => {
      ElMessage.success('Copied!')
    })
    .catch(() => {
      ElMessage.error('Copy failed!')
    })
}

watchEffect(() => {
  // refVal.value!.innerHTML = code
  useSyntaxHighlighter(code, lang, refVal)
})
</script>

<style scoped lang='scss'>
.code-block {
  position: relative;

  .code-language {
    position: absolute;
    top: 2px;
    right: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #aaa;
  }

  .code-copy {
    position: absolute;
    top: 12px;
    right: 0;
    padding: 8px;
    font-size: 18px;
    color: #333;

    &:hover {
      color: #aaa;
    }

    .icon {
      cursor: pointer;
    }
  }
}
</style>
