import { ElButton, ElNotification } from 'element-plus'

let oldUrlList: Array<string | undefined> | null = null
const scriptReg = /<script.*src=["'](?<src>[^"']+)/g

// 获取首页script标签的链接数组
async function getScriptChange() {
  let match
  const result = []
  const html = await fetch('/').then(res => res.text())

  // eslint-disable-next-line no-cond-assign
  while ((match = scriptReg.exec(html))) {
    result.push(match?.groups?.src)
  }
  return result
}

// 检查是否需要重新加载
async function checkUpdate() {
  const newUrlList = await getScriptChange()
  let result = false

  if (!oldUrlList) {
    result = false
  }
  else if (newUrlList.length !== oldUrlList.length) {
    result = true
  }
  else if (newUrlList.some(newUrl => oldUrlList?.every(oldUrl => oldUrl !== newUrl))) {
    result = true
  }

  oldUrlList = newUrlList
  return result
}

// 倒数计时组件VNode
const countDownVNode = {
  setup() {
    const countDown = ref(10)

    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value === 0) {
        clearInterval(timer)
        location.reload()
      }
    }, 1000)

    onBeforeUnmount(() => clearInterval(timer))

    return () => (
      <div class="w-242px">
        <p>
          检测到更新，
          {countDown.value}
          秒后将重新加载页面！
        </p>
        <ElButton
          class="float-right mt-6px"
          type="primary"
          size="small"
          onClick={() => location.reload()}
        >
          立即刷新
        </ElButton>
      </div>
    )
  },
}

// 自动检测更新项目
function autoUpdate() {
  setTimeout(async () => {
    const isUpdate = await checkUpdate()
    if (isUpdate) {
      ElNotification({
        title: '有新内容',
        message: h(countDownVNode),
        type: 'warning',
        duration: 0,
        showClose: false,
      })
    }
    autoUpdate()
  }, 1000 * 10)
}

if ((import.meta.env.MODE === 'production')) autoUpdate()
