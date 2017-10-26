var u = navigator.userAgent; // 排名
var host = "";
var isApp = /baoxiang/.test(navigator.userAgent);
var isMobile = !!u.match(/AppleWebKit.*Mobile.*/) && !!u.match(/AppleWebKit/);
var isPad = u.indexOf('iPad') > -1
var addressAlert = "";
var isSuccessLogin = false;
var address=""
traversal();
// loginFun();
$(".mobilePage .realCanvas").css("height", window.screen.availWidth * .8);
if (window.innerWidth > 750 && !isMobile) {
    $(".mobilePage .realCanvas").css("height", 750 * 0.8)
}

if (isMobile) {
    $("body").addClass("mobileBody");
    $(".wrapper").css("min-width", window.screen.availWidth);
}

var canvas = document.getElementById("wheelcanvas");
if (!canvas.getContext) {
    $(".offen").hide();
    $(".reserve").show();
} else {
    $(".offen").show();
    $(".reserve").hide();
}


//是否登录
function loginFun(callback) {
    $.ajax({
        url: host + '/secure/get-login-info.html?t=' + new Date().getTime(),
        success: function (json) {
           
            if (!json.isLogin) {
                if (isMobile) {
                    layer.open({
                        content: '您还没有登录，马上去登录？'
                        , btn: ['确定', '取消']
                        , yes: function (index) {
                            if (isApp) {
                                location.href = "baoxiang://APPLogin";
                            } else {
                                location.href = "/login/index.html?redirect=" + location.href;
                            }
                            layer.close(index);
                        }
                    });
                } else {
                    var loginLayer;
                    loginLayer =
                        layer.open({
                            type: 2,
                            area: ['489px', '454px'],
                            shade: [0.6, '#000'],
                            closeBtn: true,
                            title: false, //不显示标题
                            content: host + '/index/login-layer.html' //捕获的元素
                        });
                }
                return;
            } 
            
            addressAlert = '<form id="addressForm" action="" class="addForm layerBox">' +
                '<h3>填写收货地址</h3><div class="moveTop">' +
                '<label class="addressUser clearfix">' +
                '<span class="f_s fl">收货人：</span>' +
                '<span class="f_userName  fl " id="successUserName">' + json.callName + '</span>' +
                '</label>' +
                '<label class="clearfix">' +
                '<span class="f_s fl">联系电话：</span>' +
                '<span class="f_mobile fl " id="successMobile">' + json.mobile + '</span>' +
                '</label>' +
                '<label class="address_txt clearfix">' +
                '<span class="f_s fl">地 址：</span>' +
                '<input type="text" placeholder="为确保您能收到，请填写详细地址" class="address_val fl  f_i" id="successAddressVal" maxlength="25" value="' + address + '"/>' +
                '</label>' +
                '</div>' +
                '<p class="pc-empty red"></p>' +
                '<button type="button" id="submit" class="submit blue button">提交</button>' +
                '</form >'

                if(typeof callback == "function"){
                    callback();
                }

        }
    });
}
function loginSuccess() {
    location.reload();
}
//奖品接口
function traversal() {
    $.ajax({
        url: host + '/singles-day-eleven/getGiftList.html?t=' + new Date().getTime(),
        success: function (json) {
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
                return false;
            }else{
                loginFun();
            }

            address = json.address;
            setturntable(json);

        }
    });
}

var layerReserve = "";
//填写收货地址
$(".address").on("click", function () {    
    loginFun(addressFun);
})

function addressFun(){
    if (!isMobile) {
        layerReserve = layer.open({
            type: 1,
            area: ['666px', '420px'],
            shade: [0.6, '#000'],
            closeBtn: true,
            title: false, //不显示标题
            content: addressAlert
        })
    } else {
        layerReserve = layer.open({
            title: false,
            content: addressAlert,
            skin: "address"
        })
    }

    $("#successAddressVal").val(address)
}

$(document).on("click", ".submit", function () {
    var txt = $(".address_val").val();
    if (!txt) {
        $('.pc-empty').show();
        $('.pc-empty').text('请填写不超过25位字符');
        return false
    } else {
        $('.pc-empty').hide();
    }
    $.ajax({
        url: host + '/singles-day-eleven/saveAddress.html',
        type: "post",
        cache: false,
        data: { address: txt },
        success: function (json) {

            layer.close(layerReserve);
            if (!json.success) {
                loginFun()
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
                return false;
            }
            if (!isMobile) {
                layer.msg("地址保存成功")
            } else {
                layer.open({
                    content: "地址保存成功",
                    skin: 'msg',
                    time: 2
                });
            }
            traversal()
        }
    })
})

