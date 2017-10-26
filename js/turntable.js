
function setturntable(initial) {

    /*公共参数*/
    var w, h;
    if (typeof layer.msg === "function") {
        w = 444;
        h = 444;
    } else {        
        w = window.screen.availWidth * 0.8;
        h = window.screen.availWidth;
    }
    if(window.innerWidth>750 && $(".page").hasClass("mobilePage") && !isMobile){
        w = 750 * 0.8;
        h = w;
    }

    var width = w, height = h;
    var halfWidth = width / 2;
    var turnplate = {
        restaraunts: [],				//大转盘奖品名称
        colors: ["#ffb933", "#ffd57c", "#ffb933", "#ffd57c", "#ffb933", "#ffd57c"],//动态添加大转盘的奖品与奖品区域背景颜色
        outsideRadius: halfWidth * 0.83,			//大转盘外圆的半径
        textRadius: halfWidth * 0.58,				//大转盘奖品位置距离圆心的距离
        insideRadius: halfWidth / 10,			//大转盘内圆的半径
        startAngle: 0,	//开始角度
        bRotate: false,				//false:停止;ture:旋转
        fontSize: Math.floor(h / 30) + 'px Microsoft YaHei,微软雅黑,Heiti SC,helvetica neue LT'
    };
    if (!isMobile) {
        turnplate.textRadius = halfWidth * 0.65;
    }
    turnplate.restaraunts = initial.giftList;

    // 提前获得奖品图片的宽高
    var imgW, imgH, i = 0, multiple = "";
    if(!isMobile){
        multiple = (h / 500).toFixed(1);
    }else{
        multiple = (h / 700).toFixed(1);
    }
    turnplate.restaraunts.forEach(function (value, index) {
        imgReady(value.logo, function () {
            imgW = Math.ceil(this.width * multiple);
         
            imgH = Math.ceil(this.height * multiple);
            var img = document.createElement("img");
            img.src = turnplate.restaraunts[index].logo;
            turnplate.restaraunts[index].width = imgW;
            turnplate.restaraunts[index].height = imgH;
            turnplate.restaraunts[index].img = img;
            //全部读取完成后在绘制canvas
            if (++i >= 6) {
                window.onload = function () {
                    drawRouletteWheel();
                };
                drawRouletteWheel();
            }
        });
    });

    var rotateTimeOut = function () {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 5000,
            callback: function () {
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt) {
        var angles = item * (360 / turnplate.restaraunts.length);

        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 360 - angles + 1800 - 120,//180是加了5圈，360是反方向旋转
            duration: 8000,
            callback: function () {
                if (!isMobile) {
                    layer.alert('恭喜获得<span class="red">' + txt.name + '</span>');
                } else {
                    layer.open({
                        content: '恭喜获得<span class="red">' + txt.name + '</span>'
                        , btn: '我知道了'
                    });
                }            
                $('.pointer').removeClass("disabled");
            }
        });
    };

    /*开始旋转*/
    $('.pointer').click(function () {
        var _this = $(this);

        if(_this.hasClass("disabled")){
            return false;
        }

        _this.addClass("disabled");
        
        $.ajax({
            url: host + "/singles-day-eleven/lottery.html",
            cache:false,
            success: function (json) {                
                if (!json.success) {//未登录
                    loginFun();
                    _this.removeClass("disabled");           
                    return false;
                }
                if (!json.type) {
                    if (!isMobile) {
                        layer.msg(json.message);
                    } else {
                        layer.open({
                            content: json.message,
                            skin: 'msg',
                            time: 2
                        });
                    }
                    _this.removeClass("disabled");
                    return false;
                }

                if(!json.hasChance){
                    _this.removeClass("disabled");
                    noChance();
                }

                initial.giftList.forEach(function (value, index) {
                    if (value.id == json.giftId) {
                        rotateFn(index, turnplate.restaraunts[index]);
                    }
                })

            }
        });

    });
    function noChance() {
        if (!isMobile) {
            layer.confirm('当前&nbsp;<span class="red">0</span>&nbsp;次抽奖机会,去投资吧？', {
                btn: ['去投资', '取消'] //按钮
            }, function () {
                window.open("/lc/invest/list.html");
            });
        } else {
            layer.open({
                content: '当前&nbsp;<span class="red">0</span>&nbsp;次抽奖机会,去投资吧'
                , btn: ['去投资', '取消']
                , yes: function () {
                    if (isApp) {
                        location.href = "baoxiang://APPProjectList?type=invest"
                    } else {
                        location.href = "/lc/invest/list.html"
                    }
                }
            });
        }
    }

    /*随机函数*/
    function rnd(n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;

    }





    /*对转盘进行渲染*/
    function drawRouletteWheel() {
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length / 2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0, 0, width, width);

            if (window.devicePixelRatio) {
                canvas.style.width = width + "px";
                canvas.style.height = width + "px";
                canvas.height = width * window.devicePixelRatio;
                canvas.width = width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "transparent";
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = turnplate.fontSize;

            for (var i = 0; i < turnplate.restaraunts.length; i++) {
                var angle = turnplate.startAngle + i * arc + 0;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(halfWidth, halfWidth, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(halfWidth, halfWidth, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();

                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //----绘制奖品开始----
                ctx.fillStyle = "#5c1e08";
                var text = turnplate.restaraunts[i];
                var line_height = 40;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(halfWidth + Math.cos(angle + arc / 2) * turnplate.textRadius, halfWidth + Math.sin(angle + arc / 2) * turnplate.textRadius);

                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                ctx.fillText(text.name, -ctx.measureText(text.name).width / 2, 0);
                //rotate方法旋转当前的绘图
                var move = -20;
                if(typeof layer.msg === "function"){
                    move = -38;

                }else{
                    if(h <= 320){
                        move = -21;
                    }else if(320 < h && h <= 411 ){
                        move = -21;
                    }else if(411 < h && h <= 766 ){
                        move = -25;
                    }else if(766 <= h && h <= 768 ){
                        move = -50;
                    }else if(h > 768){
                        move = -60;
                    }
                }

                //添加对应图标
                ctx.drawImage(text.img, move, 0, text.width, text.height);
                
                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();

                //----绘制奖品结束----
            }
        }
    }
}

