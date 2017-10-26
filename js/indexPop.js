/*
 * Created by liuhan on 2016/9/5.
 * 网站首页弹出广告
 */

(function(){
    var session = sessionStorage.getItem("indexPop"),
        d = new Date().getTime();

    if(!session && (d <= 1473436799000)){
        var html = "";

        html += '<div class="indexPop" style="width:100%;height:100%;background-color:#000;background-color:rgba(0,0,0,.6);position:fixed;left:0;top:0;z-index:999999;">';
        html += '<div class="cont" style="width:1560px;height:1024px;margin:-512px 0 0 -780px;background:url(//www.bxjr.com/topic/images/delay/billion.png) no-repeat center center;position:absolute;left:50%;top:50%;">';
        html += '<a class="close" href="" style="position:absolute;left:1000px;top:210px;"><img src="//www.bxjr.com/topic/images/delay/close.png" /></a>';
        html += '<a class="indexPopJump" href="" style="position:absolute;left:600px;top:700px;"><img src="//www.bxjr.com/topic/images/delay/btn.png" /></a>';
        html += '</div>';
        html += '</div>';

        $("body").append(html);
    }

    $(".indexPop a").on("click", function(e){
        $(this).parents(".indexPop").hide();
        sessionStorage.setItem("indexPop", "true");

        if($(this).hasClass("indexPopJump")){
            location.href = "//www.bxjr.com/about/content/1086.html";
        }

        e.preventDefault();
    });
	//获取cookie
	function getCookie(name)
	{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
	}
	var isNew=getCookie("isNew")// isNew  1跳转新首页  0跳转老首页
	
	if(location.pathname.indexOf("indexOld")>-1){	
		if(isNew=="1"){
			window.location="/"
		}
	}else if(location.pathname=="/"){
		if(isNew=="0"){
			window.location="/indexOld/index.html"
		}
	}

	 $("#oldNewSwitch").on("click",function(){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
		
        document.cookie = "isNew=1;path=/";
        window.location="/"
    })
	$("#newToOld").css("display","block")
	$("#newToOld").on("click",function(){
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "isNew=0;path=/";
        window.location="/indexOld/index.html"
    })
    
    var closrBtn = document.getElementsByClassName("bx_bottomNav_close")[0];
    console.log( document.getElementsByClassName("bx_bottomNav_close"))

    if(closrBtn){
        closrBtn.style.cssText = 'width:40px;' + 'height:40px;' + 'background:url(/topic/images/delay/close-btn.png) no-repeat center center;' + 'text-indent:-999em;' + 'left:42px;' + 'top:-14px;';
        closrBtn.parentElement.previousElementSibling.removeAttribute("target");
        closrBtn.parentElement.parentElement.previousElementSibling.removeAttribute("target");
        closrBtn.parentElement.previousElementSibling.previousElementSibling.removeAttribute("target");

        document.getElementsByClassName("bx_leftNav")[0].getElementsByTagName("img")[0].style.height = "auto";
    }
}());