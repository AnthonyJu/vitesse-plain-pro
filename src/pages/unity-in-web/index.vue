<template>
  <div ref="container" relative full overflow-hidden>
    <canvas id="unity-canvas" style="width: 1920px; height: 1080px;" />
    <button id="btn">旋转Cube</button>
  </div>
</template>

<route lang='yaml'>
meta:
  title: unity 与 web 交互
  fullContent: true
</route>

<script setup lang="ts">
const container = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(container)

// UnityInstance 用于存储 Unity 实例
let UnityInstance: any = null

// buildUrl 为 Unity 打包后的文件夹路径，我改为了unity，就是上面打包的Build文件夹
const buildUrl = './unity'
const config = {
  dataUrl: `${buildUrl}/Builds.data`,
  frameworkUrl: `${buildUrl}/Builds.framework.js`,
  codeUrl: `${buildUrl}/Builds.wasm`,
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'DefaultCompany',
  productName: 'WebGL',
  productVersion: '0.1',
}

// 这是 Unity 调用 Web 端的方法，在 jslib 文件中定义的函数
window.WebMethod = function (str: string) {
  ElMessage.success(str)
}

onMounted(() => {
  // 设置 canvas 的宽高
  const canvas = document.querySelector<HTMLCanvasElement>('#unity-canvas')
  canvas!.style.width = `${width.value}px`
  canvas!.style.height = `${height.value}px`
  window.addEventListener('resize', () => {
    canvas!.style.width = `${width.value}px`
    canvas!.style.height = `${height.value}px`
  })

  // 加载 Unity
  const script = document.createElement('script')
  script.src = `${buildUrl}/Builds.loader.js`
  document.body.appendChild(script)
  script.onload = () => {
    window.createUnityInstance(
      canvas,
      config,
      (progress: number) => {
        // eslint-disable-next-line no-console
        console.log(`加载中:${progress * 100}%`)
      },
    )
      .then((unityInstance: any) => {
        // 加载完成后，将 UnityInstance 赋值给全局变量
        UnityInstance = unityInstance
      })
      .catch((message: any) => {
        // eslint-disable-next-line no-console
        console.log(message)
      })
  }

  // 前端页面向unity页面传值需用到UnityInstance.SendMessage()函数，调用格式如下：
  // SendMessage(unityObject,unityMethodName,value)
  // unityObject——unity脚本挂载对象名
  // unityMethodName——unity脚本内调用方法名（需为public方法）
  // value——前端需要传出的值
  const btn = document.getElementById('btn')
  btn!.onclick = function () {
    UnityInstance.SendMessage('Cube', 'RotateX', 20)
  }
})
</script>

<style lang='scss' scoped>
#btn {
  position: absolute;
  top: 10px;
  right: 0;
  left: 0;
  z-index: 999;
  width: 100px;
  height: 40px;
  margin: auto;
}
</style>
