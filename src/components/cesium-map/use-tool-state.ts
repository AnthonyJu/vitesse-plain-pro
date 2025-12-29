/**
 * Cesium 工具状态管理
 * 用于协调 draw 和 measure 等工具的互斥状态
 */

type ToolType = 'draw' | 'measure' | ''

// 全局状态
const activeTool = ref<ToolType>('')
const deactivateCallbacks = new Map<ToolType, () => void>()

export function useToolState(toolType: ToolType) {
  // 注册停用回调
  function registerDeactivate(callback: () => void) {
    if (toolType) {
      deactivateCallbacks.set(toolType, callback)
    }
  }

  // 激活当前工具（会停用其他工具）
  function activate() {
    if (activeTool.value && activeTool.value !== toolType) {
      // 停用其他工具
      const callback = deactivateCallbacks.get(activeTool.value)
      callback?.()
    }
    activeTool.value = toolType
  }

  // 停用当前工具
  function deactivate() {
    if (activeTool.value === toolType) {
      activeTool.value = ''
    }
  }

  // 检查当前工具是否激活
  const isActive = computed(() => activeTool.value === toolType)

  return {
    activeTool: readonly(activeTool),
    isActive,
    activate,
    deactivate,
    registerDeactivate,
  }
}
