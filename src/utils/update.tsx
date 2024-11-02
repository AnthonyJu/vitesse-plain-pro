import { ElButton, ElNotification } from 'element-plus'

let oldUrlList: (string | undefined)[] = []
const scriptReg = /<script.*src=["'](?<src>[^"']+)/g

// 获取首页script标签的链接数组
async function getScriptChange() {
  let match: RegExpExecArray | null = null
  const result: (string | undefined)[] = []
  const html = await fetch('/').then(res => res.text())

  // eslint-disable-next-line no-cond-assign
  while ((match = scriptReg.exec(html))) {
    result.push(match?.groups?.src)
  }
  return result
}

// 是否需要重新加载
async function needToReload() {
  const newUrlList = await getScriptChange()

  let reload = false

  if (!oldUrlList) {
    reload = false
  }
  else if (newUrlList.length !== oldUrlList.length) {
    reload = true
  }
  else if (newUrlList.some(newUrl => oldUrlList?.every(oldUrl => oldUrl !== newUrl))) {
    reload = true
  }

  oldUrlList = newUrlList

  return reload
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
          检测到新版本，
          {countDown.value}
          秒后将重新加载页面！
        </p>
        <ElButton
          class="float-right mt-6px"
          type="primary"
          size="small"
          onClick={() => location.reload()}
        >
          立即更新
        </ElButton>
      </div>
    )
  },
}

// 检测更新
export async function checkUpdate() {
  const reload = await needToReload()
  if (reload) {
    ElNotification({
      title: '版本更新',
      message: h(countDownVNode),
      type: 'warning',
      duration: 0,
      showClose: false,
    })
  }
  return reload
}

// 自动检测更新
export function autoUpdate() {
  setTimeout(async () => {
    const reload = await checkUpdate()
    if (!reload) autoUpdate()
  }, 1000 * 15)
}

// 生产环境自动检测更新
if ((import.meta.env.MODE === 'production')) autoUpdate()
