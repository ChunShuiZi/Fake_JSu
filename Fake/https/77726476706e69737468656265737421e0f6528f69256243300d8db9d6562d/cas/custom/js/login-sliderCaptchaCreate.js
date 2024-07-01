vpn_eval((function(){
function  createSliderCaptcha(){
    $.ajax({
        url: "sliderCaptcha.do",
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            $("#img1").attr('src', 'data:image/png;base64,' + data.bigImage);
            $("#img2").attr('src', 'data:image/png;base64,' + data.smallImage);
            initCaptchaIndex();
        }
    })
}
function initCaptchaIndex() {
    //初始化
    $("#captcha").sliderCaptcha("reset");
    $("#captcha").sliderCaptcha({
        repeatIcon: 'fa fa-redo',
        setSrc: function () {
            return '';
        },
        onSuccess: function () {
        }
    });
}

}
).toString().slice(12, -2),"");