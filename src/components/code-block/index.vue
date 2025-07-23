<template>
  <div class="code-block">
    <div ref="code" />
    <div class="code-lang-copy">
      <div class="code-language">{{ lang }}</div>
      <div v-if="isSupported" class="code-copy i-carbon-copy text-18px" title="复制代码" @click="copyFn" />
    </div>
  </div>
</template>

<script setup lang='ts'>
interface Props {
  code: string
  lang: string
}

const { code, lang } = defineProps<Props>()

const container = useTemplateRef<HTMLDivElement>('code')
useSyntaxHighlighter(code, lang, container)

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
</script>

<style scoped lang='scss'>
:deep(pre.shiki) {
  padding: 16px;
  margin: 0;
  overflow: auto;
  font-size: 16px;
  border-radius: 8px;

  code {
    font-family: "DM Mono", monospace;
  }
}

.code-block {
  position: relative;

  :deep(.vitesse-dark) {
    background-color: #1e1f22 !important;
  }

  :deep(.vitesse-light) {
    background-color: #f5f5f5 !important;
  }

  .code-lang-copy {
    position: absolute;
    top: 7px;
    right: 7px;
    display: flex;
    gap: 10px;
    align-items: center;

    .code-language {
      font-size: 12px;
      font-weight: 500;
      color: #aaa;
    }

    .code-copy {
      font-size: 18px;
      color: #464646;
      cursor: pointer;

      &:hover {
        color: #a2a2a2;
      }
    }
  }
}
</style>
