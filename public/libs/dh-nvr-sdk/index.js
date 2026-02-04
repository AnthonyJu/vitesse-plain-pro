/*
* 本文件仅供demo使用
*/
 
//webpack中引用此代码块，格式不要随意改动
  //开发模式需要import,打包给3.0的变成了全局变量，不需要
    

let $ip,
    $port,
    $user,
    $password, 
    $loginState, 
    $stream,
    $volume,
    $canvas, //canvas播放视频DOM
    $video, //video播放视频DOM
    $canvas_ivs, //canvas绘图DOM
    $video_wrap, //视频外层Wrap
    $videoLoading,  //“加载中...”提示
    WndIndex = 0,  //宫格窗口Id
    WebCaps = null;  //webCapsConfig文件转存变量
let isLogin = false;  //是否登录
let channel = 0;  //当前通道
let curPage = 1;  //视频下载列表的当前页
let totalPage = 1;  //视频下载列表的总页数
let recordArr = [];  //视频文件数组
let canvasSon = null;  //canvas绘图实例
let playerInstance = [];  //播放|回放实例数组
let speedX = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
let recordInstance = [];  //录像下载实例数组
let talkInstance = [];  //对讲实例数组
let ivsInstance = [];  //canvas绘图实例数组
let cutInstance = [];  //视频裁剪实例数组
let onlineChannel = [];  //当前成功拉流的视频通道数组
let isCuting = false;  //是否正在进行视频裁剪
let downList = [];  //勾选的视频下载列表
let downItemIndex = 0;  //视频下载索引
let canvasParam = {  //canvas绘图默认传参
    'strokeColor': '#FF0000',
    'title': '',
    'resizeEnable': false,
    'moveEnable': false,
    'closeEnable': true,
    'array': true,
    'showSize': false,
    'selectType': 'inSide',
    'disappear': true,
    'selected': false
}
const lINENUMBER = 16; //回放列表每页显示录像条数
let curEnlargeWnd = 0;

/**
 * @description 初始化
 */
const init = () => { 
    let videoStr = '';
    for(var i = 0; i < 16; i++) {
        videoStr += '<div wnd-index="' + i + '" style="float: left; background-color: #000; position: relative; width: 100%; height: 100%;overflow:hidden;border:1px solid rgb(125,125,125)"><canvas id="h5_canvas_' + i + '" style="width:100%;height:100%;"></canvas><p id="h5_loading_' + i + '" class="video_loading"  style="display:none">加载中...</p><video id="h5_video_' + i + '" style="display: none;width:100%;height:100%;position:absolute;top:0;left:0"></video><canvas id="h5_ivs_' + i + '" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;" width="500" height="300"></canvas></div>';
    }
    document.querySelector('.h5-play-wrap').innerHTML = videoStr;
    document.querySelectorAll('.h5-play-wrap div').forEach((item, index) => {
        item.addEventListener('click', function(event) {
            let _wndIndex = event.target.parentNode.getAttribute('wnd-index') - 0;
            if(!(playerInstance[_wndIndex] && playerInstance[_wndIndex].isPlayback)) {
                channel = event.target.parentNode.getAttribute('channel') - 0;
                document.querySelectorAll('#h5_channel_list li').forEach(item => {item.classList.remove('fn-fontRed')});
            }
            document.querySelectorAll('.h5-play-wrap div').forEach(function(item, index) {
                if(index === _wndIndex) {
                    item.style.borderColor = 'rgb(255, 204, 0)';
                    if(!(playerInstance[_wndIndex] && playerInstance[_wndIndex].isPlayback)) {
                        if(onlineChannel.indexOf(channel) > -1) {
                            document.querySelector('#h5_channel_list li[channel="'+channel+'"]').classList.add('fn-fontRed');
                        }
                    }
                    WndIndex = _wndIndex;
                    setVideoDom();
                } else {
                    item.style.borderColor = 'rgb(125, 125, 125)';
                }
            });
            document.getElementById('currentTimes').innerText = speedX[WndIndex] + 'X';
        })
    });
    $ip = $('#h5_ip');
    $port = $('#h5_port');
    $user = $('#h5_user');
    $password = $('#h5_password');
    $loginState = $('#h5_loginState');
    $stream = $('#h5_stream');
    $volume = $('#h5_volume');
    $video_wrap = document.querySelector('.h5-play-wrap');
    setVideoDom();

    let inputArr = document.querySelectorAll('input[btn-for]');
    for(let node of inputArr) {
        node.addEventListener('click', bindClickEvent);
    }

    let selArr = document.querySelectorAll('select[sel-for]');
    for(let node of selArr) {
        node.addEventListener('change', bindChangeEvent);
    }

    $volume.addEventListener('input', function(event) {
        let vol = event.target.value - 0;
        $('#h5_volume_value').innerText = vol;
    });
    $volume.addEventListener('change', function(event) {
        let vol = event.target.value - 0;
        if(playerInstance[WndIndex]) {
            playerInstance[WndIndex].setAudioVolume(vol);
        }
    });
    $('#h5_first').addEventListener('click', function() {
        if(curPage != 1) {
            curPage = 1;
            updateTable();
        }
    });
    $('#h5_pre').addEventListener('click', function() {
        if(curPage > 1) {
            curPage = curPage - 1;
            updateTable();
        }
    });
    $('#h5_next').addEventListener('click', function() {
        if(curPage < totalPage) {
            curPage = curPage + 1;
            updateTable();
        }
    });
    $('#h5_last').addEventListener('click', function() {
        if(curPage != totalPage) {
            curPage = totalPage;
            updateTable();
        }
    });
    $('#h5_goPage').addEventListener('click', function() {
        let val = $('#h5_goNumber').value - 0;
        if(curPage != val) {
            curPage = val;
            updateTable();
        }
    });
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach((item, index) => {
        document.addEventListener(item, fullscreenchange, false);
    });
}
/**
 * @description 切换宫格时重新设置当前视频dom
 */
const setVideoDom = () => {
    $canvas = $('#h5_canvas_' + WndIndex);
    $video = $('#h5_video_' + WndIndex);
    $canvas_ivs  = $('#h5_ivs_' + WndIndex);
    $videoLoading = $('#h5_loading_' + WndIndex);
}
/**
 * @description 登录
 */
const onLogin = () => {

    playerInstance.forEach(item => {
        if(item) {
            item.close();
            item = null;
        }
    });
    talkInstance.forEach(item => {
        if(item) {
            item.talk('off');
            item = null;
        }
    });
    recordInstance.forEach(item => {
        if(item) {
            item.startRecord(false);
            item = null;
        }
    });
    $('#h5_channel_list').innerHTML = '';
    $('#h5_playback_channel').options.length = 0;
    onlineChannel = [];
    
    let ip = $ip.value;
    let port = $port.value;
    let target = ip + ':' + port;
    setIP(target);
    
    $loginState.innerHTML = '未登录';
    $loginState.style.color = 'red';
    /**
     * RPC.login 登录
     * @param {string} $user.value 用户名
     * @param {string} $password.value 密码
     * @param {boolean} false 是否httpOnly,默认false
     * @returns {Promise} 
     */
    RPC.login($user.value, $password.value, false).then((res) => {
        console.info('登录成功');
        setCookie('DWebClientSessionID', '', -1);
        setCookie('DhWebClientSessionID', '', -1);
        /**
         * RPC.keepAlive 保活
         */
        RPC.keepAlive(300, 60000, _getSession(), target);
        const browser = BrowserType();
        if (browser.includes('ie')) {
            window.onunload = () => {
                ajax({
                    url: 'global.logout'
                });
            };
        } else if (browser.includes('chrome')) {
            const params = {
                method: 'global.logout',
                params: null,
                id: 10000,
                session: _getSession()
            };
            pubsub.subscribe('onbeforeunload',() => {
                navigator.sendBeacon('/RPC2', JSON.stringify(params));
            });
        } else {
            pubsub.subscribe('onbeforeunload',() => {
                ajax({
                    url: 'global.logout'
                });
            });
        }
        $loginState.style.color = 'green';
        $loginState.innerHTML = '已登录';
        setLoginState(true);
        afterLogin();
    }).catch((err) => {
        console.log(err);
        loginError(err);
    });
}
/**
 * @description 登录之后调用，获取设备能力，获取通道、码流
 */
const afterLogin = () => {
    $('#h5_playback_channel').options.length = 0;
    $('#h5_channel_list').innerHTML = '';
    /**
     * RPC.getUrlData 获取设备上的文件
     * @param {string} 文件路径
     * @returns {Promise}
     */
    RPC.getUrlData(`/web_caps/webCapsConfig?version=2.400&${new Date().getTime()}`).then(json => {
        WebCaps = json;
        if(WebCaps.deviceType.indexOf('SD') > -1 || WebCaps.deviceType.indexOf('IPC') > -1) {
            /**
             * RPC.DevVideoInput.getCollect 获取模拟输入通道数
             * @returns {Promise}
             */
            RPC.DevVideoInput.getCollect().then(function (params) {
                let channelNum = params.channels;
                for(let i = 0; i < channelNum;i++) {
                    let li = document.createElement('li');
                    li.innerHTML = 'D' + (i + 1);
                    li.setAttribute('channel', i);
                    li.style.width = '140px';
                    $('#h5_channel_list').appendChild(li);
                    $('#h5_playback_channel').options.add(new Option(i+1,i));
                }
                document.querySelectorAll('#h5_channel_list li').forEach(item => {
                    item.addEventListener('click', function(event) {
                        event.stopPropagation();
                        let $el = event.target;
                        channel = $el.getAttribute('channel') - 0;
                        if(onlineChannel.indexOf(channel) > -1 && (channel != $canvas.parentNode.getAttribute('channel') - 0)) {
                            return;
                        }
                        if($el.className.indexOf('fn-fontBlue') > -1 || $el.className.indexOf('fn-fontRed') > -1) {
                            onStopPreview();
                        } else {
                            onPreview(false);
                        }
                    });
                });
            });
        }
    }).catch(() => {
        /**
         * RPC.LogicDeviceManager.getCameraAll 获取所有用户可用视频源
         * @returns {Promise}
         */
        RPC.LogicDeviceManager.getCameraAll().then(function(params) {
            let channelList = params.camera.filter(item => item.Enable === true);
            //预览，在线通道列表
            let channelArr = channelList.map(item => {
                let _name;
                item.DeviceInfo.VideoInputs.map(value => {
                    if(value && value.Enable) {
                        _name =  value.Name;
                    }
                });
                return item.UniqueChannel + ';' + _name;
            });
            // 回放，全部通道列表
            let allArr = params.camera.map(item => {
                let _name;
                if(item.DeviceInfo && item.DeviceInfo.VideoInputs) {
                    item.DeviceInfo.VideoInputs.map(value => {
                        _name =  value && value.Name;
                    });
                    return item.UniqueChannel + ';D' + (item.UniqueChannel + 1) +' ' + _name;
                }
            });
            allArr.forEach((item) => {
                if(item) {
                    let _item = item.split(';');
                    let _chan = _item[0] - 0;
                    let name =  _item[1];
                    if(name) {
                        $('#h5_playback_channel').options.add(new Option(name, _chan));
                    }
                }
            });

            channelArr.forEach((item) => {
                let _item = item.split(';');
                let _chan = _item[0] - 0;
                let name = _item[1];
                let li = document.createElement('li');
                li.innerHTML = 'D' + (_chan + 1) + ' ' + name;
                li.setAttribute('channel', _chan);
                $('#h5_channel_list').appendChild(li);
            });
            document.querySelectorAll('#h5_channel_list li').forEach(item => {
                item.addEventListener('click', function(event) {
                    event.stopPropagation();
                    let $el = event.target;
                    channel = $el.getAttribute('channel') - 0;
                    if(onlineChannel.indexOf(channel) > -1 && (channel != $canvas.parentNode.getAttribute('channel') - 0)) {
                        return;
                    }
                    if($el.className.indexOf('fn-fontBlue') > -1 || $el.className.indexOf('fn-fontRed') > -1) {
                        onStopPreview();
                    } else {
                        onPreview(false);
                    }
                });
            });
        });
    });

    $stream.options.length = 0;
    /**
     * RPC.MagicBox.getProductDefinition 获取产品定义
     * @param {string}  'MaxExtraStream' 定义名称
     * @returns {Promise}
     */
    RPC.MagicBox.getProductDefinition('MaxExtraStream').then(function(params) {
        let maxExtra = params.definition;
        $stream.options.add(new Option('主码流', 0));
        if (maxExtra > 1) {
            for(let i = 1; i <= maxExtra; i++) {
                $stream.options.add(new Option('辅码流' + i, i));
            }
        } else {
            $stream.options.add(new Option('辅码流', 1));
        }
    });

    let curDate = new Date();
    let dateString = curDate.toLocaleDateString();
    let dateSplit = dateString.split('/');
    let month = dateSplit[1] - 0;
    if(month < 10) {
        dateSplit[1] = '0' + month;
    }
    let day = dateSplit[2] - 0;
    if(day < 10) {
        dateSplit[2] = '0' + day;
    }
    let date = dateSplit.join('-');
    $('#h5_startTime').value = date + 'T' + '00:00'; 
    $('#h5_endTime').value = date + 'T' + '23:59:59'; 
}
/**
 * @description 注销
 */
const onLogout = () => {
    /**
     * RPC.Global.logout 注销接口
     * @returns {Promise}
     */
    RPC.Global.logout().then(function() {
        $loginState.style.color = 'red';
        $loginState.innerHTML = '未登录';
        setLoginState(false);
        playerInstance.forEach(item => {
            if(item) {
                item.stop();
                item.close();
                item = null;
            }
        });
        cutInstance.forEach(item => {
            if(item) {
                item.stop();
                item.close();
                item = null;
            }
        });
        talkInstance.forEach(item => {
            if(item) {
                item.talk('off');
                item = null;
            }
        });
        recordInstance.forEach(item => {
            if(item) {
                item.startRecord(false);
                item = null;
            }
        });
        $('#h5_channel_list').innerHTML = '';
        $('#h5_playback_channel').options.length = 0;
        document.querySelectorAll('[id^=h5_canvas_]').forEach(item => {
            if(item.style.display === '') {
                item.style.display = 'none';
            }
        });
        document.querySelectorAll('[id^=h5_video_]').forEach(item => {
            if(item.style.display === '') {
                item.style.display = 'none';
            }
        });
    });
}
/**
 * @description 点击下一个宫格，在当前宫格成功拉流后，自动选中下一个宫格
 */
const clickNextWnd = () => {
    let curWndType = document.querySelector('[sel-for=onChangeWdnNum]').value - 0;
    if(curWndType === 2 && WndIndex === 3 || curWndType === 3 && WndIndex === 8 || curWndType === 4 && WndIndex === 15) {
        document.querySelector('#h5_ivs_0').click();
    } else {
        document.querySelector('#h5_ivs_' + (WndIndex + 1)).click();
    }
}
/**
 * @description 预览
 * @param {boolean} isPlayback 是否是回放
 * @param {string} url 回放视频的url
 * @param {number} playbackIndex 回放视频的索引
 * @param {boolean} isChangeStream 是否是切换码流导致的重新拉流
 */
const onPreview = (isPlayback, url, playbackIndex, isChangeStream) => {
    if(playerInstance[WndIndex] && onlineChannel.indexOf(channel) > -1 && !isChangeStream){
        alert('通道' + (channel + 1) + '已存在！');
        return;
    }
    onStopPreview();
    var player = null;
    if(!isLogin) {
        alert('请先登录再预览！');
        return;
    }
    let curChannel = channel + 1; //无插件通道号从1开始
    let stream = $stream.value - 0 || 0;
    let firstTime = 0;
    let ip = $ip.value;
    let port = $port.value - 0;
    let username = $user.value;
    let password = $password.value;
    let options = {
        wsURL: 'ws://'+ ip +':' + port + '/rtspoverwebsocket',
        rtspURL: !isPlayback ?
            'rtsp://'+ ip +':' + port + '/cam/realmonitor?channel=' + curChannel + '&subtype='+ stream +'&proto=Private3':
            'rtsp://'+ ip +':' + port + '/' + url,
        username: username,
        password: password,
        lessRateCanvas:true,
        playback: isPlayback, 
        isPrivateProtocol: false,
        realm: RPC.realm, //设备登录返回的realm
        playbackIndex: playbackIndex
    };
    player = new PlayerControl(options);
    player.on('MSEResolutionChanged', function (e) {
        console.log(e)
    });
    player.on('PlayStart', function (e) {
        console.log(e);
        $videoLoading.style.display = 'none';
        let curWndType = document.querySelector('[sel-for=onChangeWdnNum]').value - 0;
        if(!player.isPlayback) {
            onlineChannel.push(channel);
            updateChannelList();
            // if(curWndType !== 1) {
            //     clickNextWnd();
            // }
        }
    });
    player.on('DecodeStart', function (e) {
        console.log(e)
        if(e.decodeMode === 'video'){
            $video.style.display = '';
            $canvas.style.display = 'none';
        }else{
            $video.style.display = 'none';
            $canvas.style.display = '';
        }
        canvasSon = new PluginCanvasES6();

        canvasSon.init($canvas_ivs, function (data) {
            rebackActivateLocalEnlarging(data);
        });
        canvasSon.addChangeShapeEvent();
        playerInstance[WndIndex] = player;
        ivsInstance[WndIndex] = canvasSon;
    });
    player.on('UpdateCanvas', function (e) {
        if(player.isPlayback) {
            let playbackIndex = player.playbackIndex;
            if (firstTime === 0) {
                firstTime = e.timestamp;
            }
            //const _left = e.timestamp - new Date(recordArr[playbackIndex].StartTime).getTime()/1000;
            $('#h5_curTime_'+ playbackIndex%lINENUMBER).innerText = e.timestamp-firstTime;
        }
    });
    player.on('GetTotalTime', function (e) {
        let playbackIndex = player.playbackIndex%lINENUMBER;
        $('#h5_totalTime_'+ playbackIndex).innerText = e;
    });
    player.on('GetFrameRate', function (e) {
        console.log('GetFrameRate: ' + e)
    });
    player.on('FrameTypeChange', function (e) {
        console.log('FrameTypeChange: ' + e)
    });
    player.on('Error', function (e) {
        //console.log('Error: ' + JSON.stringify(e))
    });
    player.on('IvsDraw', function (e) {
        //console.log('IvsDraw: ' + JSON.stringify(e))
    });
    player.on('WorkerReady',function(){
        player.connect(); 	
    });
    player.init($canvas, $video);
    $canvas.parentNode.setAttribute('channel', channel);
    $videoLoading.style.display = '';
}
/**
 * @description 更新通道列表
 */
const updateChannelList = () => {
    document.querySelectorAll('#h5_channel_list li').forEach(item => {
        item.classList.remove('fn-fontBlue');
        item.classList.remove('fn-fontRed');
        if(onlineChannel.indexOf(item.getAttribute('channel') - 0) > -1) {
            item.classList.add('fn-fontBlue');
        }
    })
}
/**
 * @description 停止预览
 */
const onStopPreview = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].stop();
        playerInstance[WndIndex].close();
        playerInstance[WndIndex] = null;
        let _index = onlineChannel.indexOf(channel);
        onlineChannel.splice(_index, 1);
        updateChannelList();
        let dom = $canvas;
        if (dom.style.display === 'none') {
            dom = $video;
        }
        dom.style.display = 'none';
        if(talkInstance[WndIndex]) {
            talkInstance[WndIndex].talk('off');
            talkInstance[WndIndex] = null;
        }
        if(recordInstance[WndIndex]) {
            recordInstance[WndIndex].startRecord(false);
            recordInstance[WndIndex] = null;
        }
    }
}
/**
 * @description 切换码流
 */
const onChangeStream = () => {
    onPreview(false, null, null, true);
}
/**
 * @description 开启音频
 */
const onTurnOnSound = () => {
    let vol = $volume.value - 0;
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].setAudioVolume(vol);
    }
}
/**
 * @description 关闭音频
 */
const onTurnSoundOff = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].setAudioVolume(0);
    }
}
/**
 * @description 开启对讲
 */
const onStartTalk = () => {
    let talkPlayer = null;
    let ip = $ip.value;
    let port = $port.value - 0;
    let username = $user.value;
    let password = $password.value;
    let curChannel = channel + 1; //无插件通道号从1开始
    let rtspURL = 'rtsp://'+ ip +':' + port + '/cam/realmonitor?channel=' + curChannel + '&subtype=5&proto=Private3';
    let optionsAudio = {
        wsURL: 'ws://'+ ip +':' + port + '/rtspoverwebsocket',
        rtspURL: rtspURL,
        username: username,
        password: password,
        isTalkService: true,
        isPrivateProtocol: false,
	    realm: RPC.realm
    }
    talkPlayer = new PlayerControl(optionsAudio);
    talkPlayer.talk('on');
    talkInstance[WndIndex] = talkPlayer;
}
/**
 * @description 关闭对讲
 */
const onStopTalk = () => {
    if(talkInstance[WndIndex]) {
        talkInstance[WndIndex].talk('off');
        talkInstance[WndIndex] = null;
    }
}

    /**
     * @description slow
     */
    const onSlow = () => {
      if(speedX[WndIndex] == null){
          speedX[WndIndex] = 1;
      }
      if(speedX[WndIndex] < 0.125){
          return;
      }
      speedX[WndIndex] = speedX[WndIndex] / 2;
      document.getElementById('currentTimes').innerText = speedX[WndIndex] + 'X';
      playerInstance[WndIndex].playFF(speedX[WndIndex]); 
  }

  /**
   * @description fast
   */
  const onFast = () => {
      if(speedX[WndIndex] == null){
          speedX[WndIndex] = 1;
      }
      if(speedX[WndIndex] > 8){
          return;
      }
      speedX[WndIndex] = speedX[WndIndex] * 2;
      document.getElementById('currentTimes').innerText = speedX[WndIndex] + 'X';
      playerInstance[WndIndex].playFF(speedX[WndIndex]); 
  }

/**
 * @description 抓图
 */
const onSnap = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].capture('test');
    }
}
/**
 * @description 针对直播的，开始本地下载
 */
const onStartRecord = () => {
    let recordPlayer = null;
    let ip = $ip.value;
    let port = $port.value - 0;
    let username = $user.value;
    let password = $password.value;
    let stream = $stream.value - 0 || 0;
    let rtspURL = 'rtsp://'+ ip +':' + port + '/cam/realmonitor?channel=' + (channel + 1) + '&subtype='+ stream +'&proto=Private3';
    let optionsRecord = {
        wsURL: 'ws://'+ ip +':' + port + '/rtspoverwebsocket',
        rtspURL: rtspURL,
        username: username,
        password: password,
        isPrivateProtocol: false,
	    realm: RPC.realm
    }
    recordPlayer = new PlayerControl(optionsRecord);
    recordPlayer.startRecord(true);
    recordInstance[WndIndex] = recordPlayer;
}
/**
 * @description 针对直播的，停止本地下载
 */
const onStopRecord = () => {
    if(recordInstance[WndIndex]) {
        recordInstance[WndIndex].startRecord(false);
        recordInstance[WndIndex] = null;
    }
}
/**
 * @description 针对回放视频的，视频裁剪
 */
const onStartCut = () => {
    let _cutIndex = document.querySelector('[btn-for=onStartCut]').getAttribute('cutIndex') - 0;
    _cutIndex = _cutIndex + ((curPage-1)*lINENUMBER);
    let cutPlayer = null;
    let ip = $ip.value;
    let port = $port.value - 0;
    let username = $user.value;
    let password = $password.value;
    let url = recordArr[_cutIndex].FilePath;
    let _rtspURL =  'rtsp://'+ ip +':' + port + '/' + url;
    let cutStartTime = $('#h5_cutStartTime').value;
    let s = new Date(cutStartTime.replace('T', ' ')).getTime();
    let startTime = new Date(recordArr[_cutIndex].StartTime).getTime();
    let range1 = (s - startTime)/1000;
    let firstTime=0;
    let optionsRecord = {
        wsURL: 'ws://'+ ip +':' + port + '/rtspoverwebsocket',
        rtspURL: _rtspURL,
        username: username,
        password: password,
        isPrivateProtocol: false, //是否私有协议，默认false
        realm: RPC.realm, //登录返回的设备Realm值
        speed: 16, //倍速拉流，16倍速
        playback: true, //是都回放
        isDownLoad:true,
        range: range1 //视频裁剪时间与视频的StartTime时间差值
    }
    cutPlayer = new PlayerControl(optionsRecord);
    cutPlayer.on('FileOver',function(){
        console.log('File Over');
        cutPlayer.startCut(false);
        isCuting = false;	
        $('#h5_cut_process').innerText = '100%';
    });
    cutPlayer.on('UpdateTimeStamp', function (e) {
        let cutStartTime1 = $('#h5_cutStartTime').value;
        let cutEndTime1 = $('#h5_cutEndTime').value;
        if (firstTime === 0) {
            firstTime = e.timestamp;
        }
        let s1 = new Date(cutStartTime1.replace('T', ' ')).getTime() / 1000;
        let e1 = new Date(cutEndTime1.replace('T', ' ')).getTime() / 1000;
        let process = parseInt(((e.timestamp-firstTime) / (e1 - s1)) * 100);
        // console.log(new Date(e.timestamp * 1000));
        $('#h5_cut_process').innerText = (process > 100 ? 100 : process)  + '%';
        if((e.timestamp >=  s1) && !isCuting) {
            cutPlayer.startCut(true);
            isCuting = true;
        }
        if((e.timestamp >= e1 ) && isCuting) {
            cutPlayer.startCut(false);
            isCuting = false;
            $('#h5_cut_process').innerText = '100%';
        }
    });
    cutPlayer.init($canvas, $video);
    cutPlayer.connect(true);
    cutInstance[WndIndex] = cutPlayer;
}
/**
 * @description 开始下载录像
 * @param {object} item 录像信息
 */
const onStartNVRDownload = (item) => {
    let _cutIndex;
    if(item) {
        _cutIndex = item.selfCheckIndex;
    }
    let firstTime=0;
    let cutPlayer = null;
    let ip = $ip.value;
    let port = $port.value - 0;
    let username = $user.value;
    let password = $password.value;
    let url = recordArr[_cutIndex].FilePath;
    let _rtspURL =  'rtsp://'+ ip +':' + port + '/' + url;
    let optionsRecord = {
        wsURL: 'ws://'+ ip +':' + port + '/rtspoverwebsocket',
        rtspURL: _rtspURL,
        username: username,
        password: password,
        isPrivateProtocol: false,
        realm: RPC.realm,
        speed: 16,
        playback: true,
        isDownLoad:true
    }
    
    cutPlayer = new PlayerControl(optionsRecord);
    
    cutPlayer.on('FileOver',function(){
        console.log('File Over');
        cutPlayer.startCut(false);
        isCuting = false;	
        $('#h5_down_process').innerText = '100%';
        downItemIndex++;
        if(downList[downItemIndex]) {
            onStartNVRDownload(downList[downItemIndex]);
        }
    });
    cutPlayer.on('UpdateTimeStamp', function (e) {
        let s1 = new Date(item.StartTime).getTime()/1000;
        let e1 = new Date(item.EndTime).getTime()/1000;
        if (firstTime === 0) {
            firstTime = e.timestamp;
        }
        let process = parseInt(((e.timestamp-firstTime) / (e1 - s1)) * 100);
        $('#h5_down_process').innerText = (process > 100 ? 100 : process)  + '%';
        if((e.timestamp >=  firstTime) && !isCuting) {
            cutPlayer.startCut(true);
            isCuting = true;
        }
        if((e.timestamp >= e1 || process>=100) && isCuting ) {
            cutPlayer.startCut(false);
            isCuting = false;
            $('#h5_down_process').innerText = '100%';
            downItemIndex++;
            if(downList[downItemIndex]) {
                onStartNVRDownload(downList[downItemIndex]);
            }
        }
    });
    cutPlayer.init($canvas, $video);
    cutPlayer.connect(true);
    cutInstance[WndIndex] = cutPlayer;
}
const stopDownLoad = ()=>{
    cutInstance.forEach(item => {
        if(item) {
            isCuting = false;
            item.stop();
            item.close();
            item.startCut(false,true);
        }
    });
    
}
/**
 * @description 开启电子放大
 */
const onStartEnlarge = () => {
    if (ivsInstance[WndIndex]) {
        ivsInstance[WndIndex].setRegionNum('rect', 1);
        let param = {...canvasParam};
        ivsInstance[WndIndex].drawStart('rect', param);
        curEnlargeWnd = WndIndex;
    }
}
/**
 * @description 开启区域放大
 */
const onStartGridEnlarge = () => {
    document.querySelectorAll('[wnd-index]').forEach((item, index) => {
        if(index === WndIndex) {
            document.querySelector('[wnd-index="' + WndIndex +'"]').style.width = '500px';
            document.querySelector('[wnd-index="' + WndIndex +'"]').style.height = '300px';
        } else {
            item.style.display = 'none';
        }
    });
}
/**
 * @description 关闭区域放大
 */
const onCloseGridEnlarge = () => {
    document.querySelectorAll('[wnd-index]').forEach((item, index) => {
        item.style.display = '';
    });
    onChangeWdnNum();
}
/**
 * @description 关闭电子放大
 */
const onStopEnlarge = () => {
    if(curEnlargeWnd != WndIndex) return;
    let dom = $canvas;
    if (dom.style.display === 'none') {
        dom = $video;
    } 
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.left = 0;
    dom.style.top = 0;
    dom.style.position = 'static';
}
/**
 * @description 绘制电子放大后的回调函数
 * @param {object} data 矩形框的坐标信息
 */
const rebackActivateLocalEnlarging = data => {
    if(curEnlargeWnd != WndIndex) return;
    let pos = data.data;
    let newData;
    if (pos[0][0] === pos[1][0]) {
        // return false;
    } else {
        newData = {
            left: pos[0][0],
            top: pos[0][1],
            right: pos[1][0],
            bottom: pos[1][1]
        }
    }
    let dom = $canvas;
    if (dom.style.display === 'none') {
        dom = $video;
    }
    // 倒着画
    if (newData.right < newData.left) {
        let tmp = newData.left;
        newData.left = newData.right;
        newData.right = tmp;
    }

    if (newData.bottom < newData.top) {
        let tmp = newData.top;
        newData.top = newData.bottom;
        newData.bottom = tmp;
    }

    let scaleW = $video_wrap.childNodes[0].clientWidth / 8191;
    let scaleH = $video_wrap.childNodes[0].clientHeight / 8191;

    let result = zoomArea(newData.left * scaleW, newData.top * scaleH, newData.right * scaleW, newData.bottom * scaleH, $video_wrap.childNodes[0].clientWidth,  $video_wrap.childNodes[0].clientHeight);
    dom.style.width = result.width + 'px';
    dom.style.height = result.height + 'px';
    dom.style.left = result.left + 'px';
    dom.style.top = result.top + 'px';
    dom.style.position = 'absolute';
    ivsInstance[WndIndex].removeShapeDrawEvent();
}
/**
 * @description 设置全屏
 */
const onSetFull = () => {
    if (getFull()) {
        exitfullScreen();
    } else {
        setfullScreen();
    }
}
/**
 * @description 查询录像
 */
const onSearchRecord = async () => {
    let allRecords = [];
    let recordNums = 0;
    let playChannel = $('#h5_playback_channel').value - 0;
    const getMediaFile = (params) => {
        return new Promise((resolve, reject) => {
            /**
             * RPC.MediaFileFind.instance 创建媒体文件查找实例
             * @returns {Promise}
             */
            RPC.MediaFileFind.instance().then(json => {
                let queryId = json.result;
                /**
                 * RPC.MediaFileFind.findFile 设置查找条件，并判断是否存在文件
                 * @param {number} queryId 实例id
                 * @param {object} params condition参数
                 * @returns {Promise}
                 */
                RPC.MediaFileFind.findFile(queryId, params).then(() => {
                    findNextFile(queryId).then(() => {
                        resolve(true);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });
    }
    const findNextFile = (queryId) => {
        return new Promise((resolve, reject) => {
            /**
             * RPC.MediaFileFind.findNextFile 在指定条件基础上查询文件信息
             * @param {number} queryId 实例
             * @param {object} 需要查找的数目
             * @returns {Promise}
             */
            RPC.MediaFileFind.findNextFile(queryId, { 'count': 100 }).then(data => {
                if (Number.isInteger(data.found)) {
                    recordNums = recordNums + data.found;
                    allRecords = allRecords.concat([...data.infos]);
                    if (data.found === 100) {
                        findNextFile(queryId).then(() => {
                            resolve(true);
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        recordArr = [...allRecords];
                        updateInfos(recordArr.slice(0, lINENUMBER));
                        updatePages();
                        stopFind(queryId);
                        resolve(true);
                    }
                } else {
                    stopFind(queryId);
                    resolve(true);
                }
            }).catch((err) => {
                reject(err);
                stopFind(queryId);
            });

        })
    }
    const stopFind = object => {
        return new Promise((resolve, reject) => {
            /**
             * PC.MediaFileFind.close 结束查询
             * @param {number} object 媒体文件查找实例ID
             * @returns {Promise}
             */
            RPC.MediaFileFind.close(object).then(() => {
                /**
                 * PC.MediaFileFind.destroy 销毁媒体文件查找实例
                 * @param {number} object 媒体文件查找实例ID
                 */
                RPC.MediaFileFind.destroy(object);
                resolve(true);
            }).catch(() => {
                reject();
            }).finally(() => {
            });
        })
    }
    const updateInfos = (infos) => {
        let table =  document.querySelector('#h5_table tbody');
        table.innerHTML = '';
        for(let i = 0; i < infos.length; i++) {
            let time = infos[i].StartTime + ' - ' + infos[i].EndTime;  //<input type="button" class="h5-button" btn-for="onGoTime" value="GO!">
            let size = Math.round(infos[i].Length / 1024);
            let newRow = table.insertRow(-1);
            newRow.innerHTML = `<td><input type="checkbox" id="h5_check_${i}"></td><td>${i+1}</td><td>${time}</td><td>${size}</td><td><span id="h5_curTime_${i}">--</span><span>/</span><span id="h5_totalTime_${i}">--</span><input type="text" id="h5_goTime_${i}" style="width: 50px;"><input type="button" class="h5-button" id="h5_button_go_${i}" value="GO!"></td>`;
        }
        document.querySelectorAll('[id^=h5_button_go_]').forEach(item => {
            item.addEventListener('click', function(event) {
                let id = item.getAttribute('id').split('_')[3] - 0;
                onGoTime(id);
            });
        });
        document.querySelectorAll('[id^=h5_check_]').forEach(function(item) {
            item.addEventListener('click', function(event) {
                event.stopPropagation();
                if(event.target.checked) {
                    //渲染裁剪时间
                    let _index = event.target.getAttribute('id').split('_')[2] - 0;
                    let startTime = recordArr[_index + lINENUMBER*(curPage-1)].StartTime.split(' ').join('T');
                    let endTime = recordArr[_index + lINENUMBER*(curPage-1)].EndTime.split(' ').join('T');
                    if(startTime.split(':')[2] === '00') {
                        startTime = startTime.substr(0, startTime.length - 3);
                    } 
                    if(endTime.split(':')[2] === '00') {
                        endTime = endTime.substr(0, endTime.length - 3);
                    } 
                    $('#h5_cutStartTime').value = startTime;
                    $('#h5_cutEndTime').value = endTime;
                    document.querySelector('[btn-for=onStartCut]').setAttribute('cutIndex', _index);
                }
            });
        });
        document.querySelectorAll('#h5_table tbody tr').forEach(function(item) {
            item.addEventListener('dblclick', function(event) {
                event.stopPropagation();
                if(event.target.nodeName === 'TD') {
                    event.target.style.color = 'blue';
                    let dom = event.target.parentNode.childNodes[1];
                    let value = dom.innerText - 1;
                    let url = recordArr[value].FilePath;
                    onStopPreview();
                    onPreview(true, url, value);
                }
            });
        });
    }
    const updatePages = () => {
        totalPage = Math.ceil(recordNums/lINENUMBER);
        $('#h5_curPage').innerText = curPage;
        $('#h5_totalPage').innerText = totalPage;
    }
    let tmpDir = [];
    try {
        /**
         * RPC.getDeviceAllInfo 获取存储信息
         * @param {string} 'getDeviceAllInfo' 方法名
         * @return {Promise}
         */
        tmpDir = await RPC.getDeviceAllInfo('getDeviceAllInfo');
    } catch(e) {
        console.log(e);
    }
    let dirs = null;
    if (tmpDir.info && tmpDir.info.length > 1) {
        dirs = 'All';
    }else {
        //dirs = tmpDir.info?[0]?.Detail?[0]?.Path ?? '/mnt/sd';
        dirs = tmpDir.info && tmpDir.info[0] && tmpDir.info[0].Detail && tmpDir.info[0].Detail[0] && tmpDir.info[0].Detail[0].Path || '/mnt/sd';
    }

    let startTime = $('#h5_startTime').value.replace('T', ' ');
    let endTime = $('#h5_endTime').value.replace('T', ' ');
    if(startTime.split(' ')[1].split(':').length < 3) {
        startTime = startTime + ':00';
    } 
    if(endTime.split(' ')[1].split(':').length < 3) {
        endTime = endTime + ':00';
    }
    let params = {
        condition: {
            Channel: playChannel,
            Dirs: [dirs],
            StartTime: startTime,
            EndTime: endTime,
            Flags: null,
            Events: ['*'],
            Types: ['dav']
        }
    };
    getMediaFile(params).catch((err) => {
        if (err && err.error && err.error.code === 285409409) {
            alert('回放功能需要确保SD卡经过设备认证');
        } else {
            alert('无数据');
        }
    });
}
/**
 * @description 勾选当前页的全部录像
 */
const onCheckAll = () => {
    let dom = $('#h5_checkAll');
    let ele = document.querySelectorAll('[id^=h5_check_]');
    let domChecked = dom.checked;
    ele.forEach((item, index) => {
        item.checked = domChecked;
    })
}
/**
 * @description 下载录像
 */
const onDownload = async () => {
    let ele = document.querySelectorAll('[id^=h5_check_]');
    downList = [];
    ele.forEach((item, index) => {
        let _id = item.getAttribute('id').split('_')[2] - 0;
        if(item.checked) {
            recordArr[(curPage - 1) * lINENUMBER + _id].selfCheckIndex = _id;
            downList.push(recordArr[(curPage - 1) * lINENUMBER + _id]);
        }
    });
    downItemIndex= 0;
    onStartNVRDownload( downList[0] );
    // if(WebCaps != null) {
    //     // let supportDownloadEncrypt = await RPC.MagicBox.getProductDefinition('SupportDownloadEncrypt').then(json => {
    //     //     return !!json.SupportDownloadEncrypt;
    //     // }).catch(err => {
    //     //     return false;
    //     // });
    //     const downFile = (name, href) => {
    //         let a = document.createElement('a');
    //         a.href = href;
    //         a.download = '';
    //         document.body.appendChild(a);
    //         a.click();
    //         setTimeout(() => {
    //             document.body.removeChild(a);
    //         }, 1000);
    //     };
    //     const loop = list => {
    //         if (list === undefined) {
    //             return;
    //         }
    //         // let tmpUrl = supportDownloadEncrypt ? '/RPC_Encrypt_Loadfile' : '/RPC_Loadfile';
    //         let tmpUrl = '/RPC_Loadfile';
    //         // let hrefs = window.location.origin + tmpUrl + list.FilePath;
    //         let hrefs = 'http://' + $ip.value + tmpUrl + list.FilePath;
    //         setTimeout( function () {
    //             downFile('', hrefs);
    //             loop(downList.shift());
    //         }, 1000);
    //     };
    //     loop(downList.shift());
    // } else {
    //     onStartNVRDownload( downList[downItemIndex] );
    // }
}
/**
 * @description 更新录像列表当前页
 */
const updateTable = () => {
    playerInstance.forEach(item => {
        if(item) {
            item.stop();
            item.close();
            item = null;
        }
    });
    $('#h5_checkAll').checked = false;
    $('#h5_curPage').innerText = curPage;
    let table =  document.querySelector('#h5_table tbody');
    table.innerHTML = '';
    let index = (curPage - 1 ) * lINENUMBER;
    let infos = recordArr.slice(index, index + lINENUMBER);
    for(let i = 0; i < infos.length; i++) {
        let time = infos[i].StartTime + '-' + infos[i].EndTime;
        let size = Math.round(infos[i].Length / 1024) + '(KB)';
        let newRow = table.insertRow(-1);
        newRow.innerHTML = `<td><input type="checkbox" id="h5_check_${i}"></td><td>${index + i+1}</td><td>${time}</td><td>${size}</td><td><span id="h5_curTime_${i}">--</span><span>/</span><span id="h5_totalTime_${i}">--</span><input type="text" id="h5_goTime_${i}" style="width: 50px;"><input type="button" class="h5-button" id="h5_button_go_${i}" value="GO!"></td>`;
    }
    document.querySelectorAll('[id^=h5_button_go_]').forEach(function(item) {
        item.addEventListener('click', function(event) {
            let id=item.getAttribute('id').split('_')[3] -0;
            onGoTime(id);
        });
    });
    document.querySelectorAll('[id^=h5_check_]').forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.stopPropagation();
            if(event.target.checked) {
                //渲染裁剪时间
                let _index = event.target.getAttribute('id').split('_')[2] - 0;
                    let startTime = recordArr[_index + lINENUMBER*(curPage-1)].StartTime.split(' ').join('T');
                    let endTime = recordArr[_index + lINENUMBER*(curPage-1)].EndTime.split(' ').join('T');
                    if(startTime.split(':')[2] === '00') {
                        startTime = startTime.substr(0, startTime.length - 3);
                    } 
                    if(endTime.split(':')[2] === '00') {
                        endTime = endTime.substr(0, endTime.length - 3);
                    }
                /* let _index = event.target.getAttribute('id').split('_')[2] - 0;
                let startTime = recordArr[_index].StartTime;
                let endTime = recordArr[_index].EndTime; */
                $('#h5_cutStartTime').value = startTime;
                $('#h5_cutEndTime').value = endTime;
                document.querySelector('[btn-for=onStartCut]').setAttribute('cutIndex', _index);
            }
        });
    });
    document.querySelectorAll('#h5_table tbody tr').forEach(function(item) {
        item.addEventListener('dblclick', function(event) {
            event.stopPropagation();
            let dom = event.target.parentNode.childNodes[1];
            if(event.target.nodeName === 'TD') {
                event.target.style.color = 'blue';
                let value = dom.innerText - 1;
                let url = recordArr[value].FilePath;
                onPreview(true, url, value);
            }
            
        });
    });
}
/**
 * @description 暂停回放
 */
const onPausePlayback = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].pause();
    }
}
/**
 * @description 继续回放
 */
const onContinuePlayback = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].play();
    }
}
/**
 * @description 停止回放
 */
const onClosePlayback = () => {
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].stop();
        playerInstance[WndIndex].close();
        playerInstance[WndIndex] = null;
        let dom = $canvas;
        if (dom.style.display === 'none') {
            dom = $video;
        }
        dom.style.display = 'none';
    }
}
/**
 * @description 录像跳到指定时间
 * @param 要跳转时间的录像的id
 */
const onGoTime = (id) => {
    let curTime = $('#h5_goTime_'+id).value - 0;
    if(playerInstance[WndIndex]) {
        playerInstance[WndIndex].playByTime(curTime);
    }
}
/**
 * @description 切换窗口分割
 */
const onChangeWdnNum = () => {
    let val = document.querySelector('[sel-for=onChangeWdnNum]').value;
    let ivsDom =  document.querySelectorAll('[id^=h5_ivs_]');
    let divDom = document.querySelectorAll('.h5-play-wrap div');
    if(val === '1') {
        divDom.forEach(item => {
            item.style.width = '100%';
            item.style.height = '100%';
            item.style.borderColor = '#000';
        });
    } else if(val === '2' ) {
        divDom.forEach((item, index) => {
            item.style.width = 'calc(50% - 2px)';
            item.style.height = 'calc(50% - 2px)';
            if(index === 0) {
                item.style.borderColor = ' rgb(255, 204, 0)';
            } else {
                item.style.borderColor = ' rgb(125, 125, 125)';
            }
        });
    } else if(val === '3') {
        divDom.forEach((item,index) => {
            item.style.height = 'calc(33.333% - 2px)';
            item.style.width = 'calc(33.333% - 2px)';
            if(index === 0) {
                item.style.borderColor = ' rgb(255, 204, 0)';
            } else {
                item.style.borderColor = ' rgb(125, 125, 125)';
            }
        });
    } else if(val === '4') {
        divDom.forEach((item, index) => {
            item.style.width = 'calc(25% - 2px)';
            item.style.height = 'calc(25% - 2px)';
            if(index === 0) {
                item.style.borderColor = 'rgb(255, 204, 0)';
            } else {
                item.style.borderColor = 'rgb(125, 125, 125)';
            }
        });
    }
    ivsDom.forEach(item => {
        item.setAttribute('width', `${item.parentNode.clientWidth}`);
        item.setAttribute('height', `${item.parentNode.clientHeight}`);
    });
    ivsInstance.forEach(item => {
        item && item.resize();
    });
    document.querySelector('#h5_ivs_0').click();
}
/**
 * @description 自定义选择器
 * @param {string} str dom元素
 */
function $(str) {
    if(str.charAt(0) == '#') {
        return document.getElementById(str.substring(1));
    } else if(str.charAt(0) == '.') {
        return document.getElementsByClassName(str.substring(1));
    } else {
        return document.getElementsByTagName(str);
    }
}
/**
 * @description 设置样式
 * @param {object} obj dom元素
 * @param {*} json css样式
 */
function setStyle (obj, json){
    for(let i in json) {
        obj.style[i] = json[i];
    }
}
/**
 * @description 绑定click事件
 * @param {object} event event对象
 */
function bindClickEvent(event) {
    let $el = event.target,
        method = $el.getAttribute('btn-for'),
        disabled = $el.getAttribute('disabled');
    if(!disabled) {
        eval(method + "()");
    }
}
/**
 * @description 绑定change事件
 * @param {object} event event对象
 */
function bindChangeEvent(event) {
    let $el = event.target,
        method = $el.getAttribute('sel-for'),
        disabled = $el.getAttribute('disabled');
    if(!disabled) {
        eval(method + "()");
    }
}
/**
 * @description 设置登录状态
 * @param {boolean} bool 设备是否已经登录
 */
function setLoginState(bool) {
    isLogin = bool;
}
/**
 * @description 转换数据坐标
 * @param {*} x1 左上角x坐标
 * @param {*} y1 左上角y坐标
 * @param {*} x2 右下角x坐标
 * @param {*} y2 右下角y坐标
 * @param {*} width 宫格宽
 * @param {*} height 宫格高
 */
function zoomArea (x1, y1, x2, y2, width, height) {
    // 小框区域的数据
    let rectArea = {
        width: x2 - x1,
        height: y2 - y1,
        centerX: (x1 + x2) / 2, // 圆心坐标
        centerY: (y1 + y2) / 2
    };
    // 放大比例,控件放大倍数上限是20
    let scale = Math.min(width / rectArea.width, height / rectArea.height, 20);

    // 原始窗口信息
    let sourceWin = {
        width: width,
        height: height,
        centerX: width / 2,
        centerY: height / 2
    };

    // 放大后的窗口区域
    let bigWinArea = {
        width: width * scale,
        height: height * scale,
        left: sourceWin.centerX - rectArea.centerX * scale,
        top: sourceWin.centerY - rectArea.centerY * scale
    };

    // 数据矫正
    if (bigWinArea.left > 0) {
        bigWinArea.left = 0;
    }
    if (bigWinArea.left < sourceWin.width - bigWinArea.width) {
        bigWinArea.left = sourceWin.width - bigWinArea.width;
    }
    if (bigWinArea.top > 0) {
        bigWinArea.top = 0;
    }
    if (bigWinArea.top < sourceWin.height - bigWinArea.height) {
        bigWinArea.top = sourceWin.height - bigWinArea.height;
    }
    return bigWinArea;
}
/**
 * @description 获取全屏状态
 */
function getFull() {
    return window.top.document.mozFullScreen || window.top.document.webkitIsFullScreen || window.top.document.msFullscreenElement;
}
/**
 * @description 全屏状态改变的回调事件
 */
function fullscreenchange() {
    if (getFull()) {
        return;
    } else {
        exitfullScreen();
    }
}
/**
 * @description 设置全屏
 */
function setfullScreen() {
    let docElm = window.top.document.documentElement;
    if (docElm.requestFullScreen) {
        docElm.requestFullScreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
    handleFullscreen(true);
}
/**
 * @description 退出全屏
 */
function exitfullScreen() {
    let docElm = window.top.document.documentElement;
    if (docElm.exitFullscreen) {
        docElm.exitFullscreen();
    } else if (docElm.mozCancelFullScreen) {
        docElm.mozCancelFullScreen();
    } else if (docElm.webkitCancelFullScreen) {
        docElm.webkitCancelFullScreen();
    } else if (docElm.msExitFullscreen) {
        docElm.msExitFullscreen();
    }
    handleFullscreen(false);
}
/**
 * @description 处理全屏开关时的窗口大小
 * @param {boolean} bool 是否要全屏
 */
function handleFullscreen(bool) {
    if (bool) {
        let wrap = {
            position: 'absolute',
            left: 0,
            top: 0,
            width: window.screen.width + 'px',
            height: window.screen.height + 'px',
            overflow: 'visible'
        }
        setStyle($video_wrap, wrap);
    } else {
        let wrap = {
            position: 'relative',
            overflow: 'hidden',
            width:'500px',
            height: '300px',
        }
        setStyle($video_wrap, wrap);
    }
}
/**
 * @description ptz云台事件
 * @param {string} type 云台事件类型
 * @param {boolean} isStop 是否停止相应事件
 */
window.onHandlePTZ = function(type, isStop) {
    let stepVal = $('#h5_ptz_step').value - 0;
    let arg2 = 0;
    let arg2Arr = ['LeftUp', 'RightUp', 'LeftDown', 'RightDown'];
    let presetArr = ['GotoPreset','SetPreset', 'ClearPreset'];
    let presetNum = $('#h5_preset').value - 0;
    if(arg2Arr.indexOf(type) > -1) {
        arg2 = stepVal;
    }
    if(!isStop) {
        if(presetArr.indexOf(type) > -1) {
            /**
             * RPC.PTZManager 云台相关
             * @param {string} 方法
             * @param {number} channel 通道
             * @param {object} 参数集合
             */
            RPC.PTZManager('start', channel, { 'code': type, 'arg1': presetNum, 'arg2': 0, 'arg3': 0 });
        } else {
            RPC.PTZManager('start', channel, { 'code': type, 'arg1': stepVal, 'arg2': arg2, 'arg3': 0 });
        }
    } else {
        RPC.PTZManager('stop', channel, { 'code': type, 'arg1': stepVal, 'arg2': arg2, 'arg3': 0 });
    }
}
//进入页面自动初始化
init();
