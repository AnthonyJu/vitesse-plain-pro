<template>
  <div class="code-block">
    <div :id="codeData.id.substring(1)" />
    <div class="code-language">{{ codeData.language }}</div>
    <div
      v-if="isSupported" class="code-copy"
      :title="copied ? 'success' : 'copy code'"
      @click="copyFn"
    >
      <Iconify v-if="!copied" class="icon" icon="carbon:copy" />
      <Iconify v-else class="checked-icon" icon="carbon:checkbox-checked" />
    </div>
  </div>
</template>

<script setup lang='ts'>
interface CodeData {
  id: string
  code: string
  language: string
}

const props = defineProps<{ codeData: CodeData }>()
useSyntaxHighlighter(props.codeData.code, props.codeData.language, props.codeData.id)

const sourceCode = ref(props.codeData.code)
const { copy, copied, isSupported } = useClipboard()
function copyFn() {
  copy(sourceCode.value)
}
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

    .checked-icon {
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
