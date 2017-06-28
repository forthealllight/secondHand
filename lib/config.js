 //这里，初始化微信JSSDK借口的config配置项
var configData;
var urlString=window.location.href;
if(urlString.indexOf('test')>0){
  var urlStr=urlString.substring(22).split('#')[0];
  var urlAddress='http://test.novaxmu.cn/transaction/api/admin/Wechat';
}else{
  var urlStr=urlString.substring(21).split('#')[0];
  var urlAddress='http://www.novaxmu.cn/transaction/api/admin/Wechat';
}

$.get(urlAddress,{url:urlStr},function(data){
      configData=JSON.parse(data);
      console.log(configData);
      configData.appId=configData.appId.substring(1,configData.appId.length-1);
      configData.nonceStr=configData.nonceStr.substring(1,configData.nonceStr.length-1);
      configData.timestamp=configData.timestamp.substring(1,configData.timestamp.length-1);
      configData.signature=configData.signature.substring(1,configData.signature.length-1);
      wx.config({
        debug:false,
        appId:configData.appId,
        timestamp:configData.timestamp,
        nonceStr:configData.nonceStr,
        signature:configData.signature,
        jsApiList:[
         'onMenuShareTimeline',
         'chooseImage',
         'previewImage',
         'uploadImage'
        ]
     });
});
wx.ready(function(){
    wx.checkJsApi({
        jsApiList:['chooseImage','previewImage','uploadImage'],
        success:function(res){
           console.log(res);
        }
    })
})
