<template>
  <el-select
    v-model="value"
    filterable
    remote
    clearable
    placeholder="请输入详细地址，例如：青岛五四广场"
    :remote-method="searchAddress"
    :loading="loading"
    class="w-380px"
    @change="handleSelectChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import axios from 'axios'

const emit = defineEmits(['choose'])

const value = ref('')
const options = ref<{ label: string, value: string }[]>([])
const loading = ref(false)

// 天地图控制台申请密钥
// https://console.tianditu.gov.cn/api/key
const tk = 'b1c9c52877e24d1599b3c08cd062236d'

async function searchAddress(keyword: string) {
  if (!keyword) {
    options.value = []
    return
  }

  loading.value = true

  try {
    const postStr = {
      keyWord: keyword,
      level: 12, // 全国级别
      mapBound: '-180,-90,180,90', // 可加范围，比如“116,39,117,40”
      // 1 含公交地铁 但是搜的不准确 7 精确 地名
      queryType: 7,
      count: 10,
      start: 0,
      queryTerminal: 10000,
    }

    const res = await axios.get('//api.tianditu.gov.cn/v2/search', {
      params: {
        postStr: JSON.stringify(postStr),
        type: 'query',
        tk,
      },
    })

    const pois = res.data?.pois || []

    options.value = pois.map((poi: any) => ({
      label: `${poi.name}（${poi.address}）`,
      value: poi.lonlat,
    }))
  }
  catch (err) {
    console.error('天地图搜索失败：', err)
    options.value = []
  }
  finally {
    loading.value = false
  }
}

// 选择起飞点
function handleSelectChange(val: any) {
  emit('choose', val)
}
</script>
