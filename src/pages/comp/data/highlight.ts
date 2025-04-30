export const noticeBarSimpleStr = `<NoticeBar text="😎孩儿立志出乡关,👨‍💻学不成名誓不还。🌳埋骨何须桑梓地,🏕人生无处不青山。"/>`

export const noticeBarIconStr = `<NoticeBar
 :text="state.textStr"
 left-icon="carbon:user-speaker"
 background="#ecf5ff"
 link="link"
 color="#409eff"
 :speed="100"
/>`

export const noticeBarScrollStr = `<NoticeBar :scrollable="true">
  <el-carousel
    height="40px"
    direction="vertical"
    :autoplay="true"
    indicator-position="none"
    :interval="3000"
  >
    <el-carousel-item v-for="v in state.noticeList" :key="v">{{ v }} </el-carousel-item>
  </el-carousel>
</NoticeBar>`
