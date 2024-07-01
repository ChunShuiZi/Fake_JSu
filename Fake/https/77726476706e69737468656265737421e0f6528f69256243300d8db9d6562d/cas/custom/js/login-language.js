vpn_eval((function(){
(function () {
    var language = navigator.browserLanguage?navigator.browserLanguage:navigator.language;
    var value = getCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE");
    if (window.location.hash) {
        var url = window.location.href;
        url = url.substr(0,url.indexOf("#")) + encodeURIComponent(window.location.hash);
        window.location.href = url;
    }
    if (typeof(value) == "undefined" ){
        if (language.indexOf("en") != -1){
            setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE","en");
            $(".language_text").text('English');
			$(".english_type").hide();
			$(".chinese_type").show();
            $(".auth_tab_content").css("min-height","280px")
            $( ".userNameText" ).attr( "placeholder" , "cell phone number" );   
        }else {
            setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE","zh_CN");
            $(".language_text").text('简体中文');
			$(".english_type").show();
			$(".chinese_type").hide();
            $(".auth_tab_content").css("min-height","325px")
            $( ".userNameText" ).attr( "placeholder" , "手机号" );
        }
        var protocol = window.location.protocol;
        if (protocol == 'https:') {
            window.location.reload();
        }else if (secure == 'false'){
            window.location.reload();
        }
    }else if (value == "en"){
        $(".language_text").text('简体中文');
		$(".english_type").show();
		$(".chinese_type").hide();
        $(".auth_tab_content").css("min-height","325px")
    }else if(value == "zh_CN") {
        $(".language_text").text('English');
		$(".english_type").hide();
		$(".chinese_type").show();
        $(".auth_tab_content").css("min-height","280px")
    }
	$(".auth-language-select").click(function() {
	if (value != "en" && value != "zh_CN"){
        value = "en";
    } else if (value == "en") {
		value = "zh_CN";
	} else if (value == "zh_CN") {
		value = "en";
	}
    setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE",value);
    window.location.reload();
})
})();

function changeLanguage(){
    var value = document.getElementById("language").value;
    if (value != "en" && value != "en_US" && value != "zh_CN"){
        value = "zh_CN";
    }
    setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE",value);
    window.location.reload();
}

function setCookie(_3a,_3b){
    var secure = window.location.protocol;
    if (secure == 'https:') {
        document.cookie=_3a+"="+escape(_3b)+";path=/"+";secure;expires="+(new Date(2099,12,31)).toGMTString();
    }else {
        document.cookie=_3a+"="+escape(_3b)+";path=/"+";expires="+(new Date(2099,12,31)).toGMTString();
    }
}

function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1) {
        cookie_pos += cookie_name.length + 1;
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
            cookie_end = allcookies.length;
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}

}
).toString().slice(12, -2),"");