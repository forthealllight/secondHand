/*
  配置应用的主要路由
 */
var myapp=angular.module('myapp',['ui.router']);
myapp.config(function($stateProvider,$urlRouterProvider){
       $urlRouterProvider.otherwise('/index');
       $stateProvider.state('index',{
        url:'/index',
        templateUrl:'view/main.html',
        controller:'AppsCtrl'
       })
       .state('add',{
        url:'/add',
        templateUrl:'../apps/add/view/my-goods-add.html',
        controller:'AddCtrl'
       })
       .state('list',{
        url:'/list',
        templateUrl:'../apps/list/view/my-goods-list.html',
        controller:'ListCtrl'
       })
       .state('list.myindex',{
        url:'/myindex',
        templateUrl:'../apps/list/view/myindex.html',
        constroller:'ListCtrl'
       })
       .state('list.mycollect',{
        url:'/collect',
        templateUrl:'../apps/list/view/mycollect.html',
        controller:'CollectCtrl'
       })
       .state('edit',{
        url:'/edit',
        params:{'commodityId':null},
        templateUrl:'../apps/edit/my-goods-edit.html',
        controller:'EditCtrl'
       })
       .state('search',{
        url:'/search',
        params:{'myParams':{}},
        templateUrl:'../apps/search/search-result.html',
        controller:'SearchCtrl'
       })
       .state('result',{
        url:'/result',
        templateUrl:'../apps/search/test-result.html',
        controller:'ResultCtrl'
       })
       .state('admin',{
        url:'/admin',
        templateUrl:'../apps/search/admin-result.html',
        controller:'ResultAdmin'
       })
    });
/*-----------------------------------------控制器部分-----------------------------*/
/***
 管理员编辑用
*/
myapp.controller('ResultAdmin',function($scope,tip,$state,userInfo,table,$timeout){
  $scope.loadTag=false;
  $scope.page=0;
  $scope.goodsList=[];
  $scope.category=null;
  $scope.myCategory=99;
  var date=new Date();
  $scope.year=date.getFullYear();
  $scope.month=date.getMonth()+1;
  $scope.day=date.getDate();
  $scope.changeType=function(){
    if($scope.myCategory==99){
      $scope.category=null
    }else{
      $scope.category=$scope.myCategory;
    }
    $scope.loadMore();
  }
  $scope.loadMore=function(){
     if($scope.loadTag){return};
     $scope.loadTag=true;
     if($scope.page==0){
        tip.load();
     }
     var date=new Date();
     $scope.year=date.getFullYear();
     $scope.month=date.getMonth()+1;
     $scope.day=date.getDate();
     $scope.category=null;
     userInfo.scroll($scope.category,$scope.page).success(function(response){
        var data=response.data.push||[];
        if(data.length==0&&$scope.goodsList.length==0){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>还没商品上架哦");
           $timeout(function(){
              $state.go('index');
           },1000)
        }
        if(data.length==0&&$scope.goodsList.length!=0){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>已无更多商品");
        }
        for(var i=0;i<data.length;i++){
          data[i].pictureA=data[i].pictureA.replace('/transaction/s','/transaction');
          data[i].pictureB=data[i].pictureB.replace('transaction/s','transaction');
          $scope.goodsList.push(data[i]);
        }
        $scope.page++;
        $scope.loadTag=false;
        tip.hide();
     });
  };
  $scope.collect=function(id){
     userInfo.isFull().success(function(response){
        if(response.errno==0){
           $.get('/transaction/api/user/Collect',{commodityId:id,method:1},function(data){
            var data=JSON.parse(data);
           if(data.errno==0){
              tip.show("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>收藏成功");
           }else if(data.errno==405){
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请勿重复收藏");
           }
          });
        }
        else if(response.errno==400){
           window.location.href="/auth/xmu?redirect_uri=transaction";
        }
        else if(response.errno==401){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>商品信息不全");
        }
      });
   };
 $scope.showBig=function(id){
    table.showBack();
    $scope.bigPic=id;
 };
 $scope.hideBig=function(){
    table.hideBack();
 };
 $scope.loadMore();
});


/*
 简要的管理端商品推送，具体时候可以删除
 */
myapp.controller('ResultCtrl',function($scope,tip,$state,userInfo,table,$timeout){
  $scope.loadTag=false;
  $scope.page=0;
  $scope.goodsList=[];
  $scope.category=null;
  var date=new Date();
  $scope.year=date.getFullYear();
  $scope.month=date.getMonth()+1;
  $scope.day=date.getDate();
  $scope.loadMore=function(){
     if($scope.loadTag){return};
     $scope.loadTag=true;
     tip.load();
     var date=new Date();
     $scope.year=date.getFullYear();
     $scope.month=date.getMonth()+1;
     $scope.day=date.getDate();
     $scope.category=null;
     userInfo.scroll($scope.category,$scope.page).success(function(response){
        if(response.error==400){
          window.location.href="/auth/xmu?redirect_uri=transaction";
        }else if(response.error==0){
          var data=response.data.push;
          if(data.length==0&&$scope.goodsList.length==0){
             tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>还没商品上架哦");
             $timeout(function(){
                $state.go('index');
             },1000);
          }
          if(data.length==0&&$scope.goodsList.length!=0){
             tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>已无更多商品");
          }
          for(var i=0;i<data.length;i++){
            $scope.goodsList.push(data[i]);
          }
          $scope.page++;
          $scope.loadTag=false;
          tip.hide();
        }
     });
  };
  $scope.collect=function(id){
     userInfo.isFull().success(function(response){
        if(response.errno==0){
           $.get('/transaction/api/user/Collect',{commodityId:id,method:1},function(data){
            var data=JSON.parse(data);
           if(data.errno==0){
              tip.show("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>收藏成功");
           }else if(data.errno==405){
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请勿重复收藏");
           }
          });
        }
        else if(response.errno==400){
           window.location.href="/auth/xmu?redirect_uri=transaction";
        }
        else if(response.errno==401){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>商品信息不全");
        }
      });
   };
 $scope.showBig=function(id){
    table.showBack();
    $scope.bigPic=id;
 };
 $scope.hideBig=function(){
    table.hideBack();
 }

});

/*
  首先来看首页部分的控制器
 */
myapp.controller('AppsCtrl',function($scope,$timeout,$interval,tip,$state,userInfo,table){
  $scope.index=1;
  $scope.collect=function(id){
    userInfo.isFull().success(function(response){
        if(response.errno==0){
           $.get('/transaction/api/user/Collect',{commodityId:id,method:1},function(data){
            var data=JSON.parse(data);
           if(data.errno==0){
              tip.show("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>收藏成功");
           }else if(data.errno==405){
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请勿重复收藏");
           }
        });
        }
        else if(response.errno==400){
           window.location.href="/auth/xmu?redirect_uri=transaction";
        }
        else if(response.errno==401){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>商品信息不全");
        }
      });

   };
 $scope.showBig=function(id){
    table.showBack();
    table.showCover();
    var myId=id.replace('/transaction/s','/transaction');
    $scope.bigPic=myId;
 };
 $scope.hideBig=function(){
    table.hideBack();
    table.hideCover();
 };
  //回车事件，调用回车事件来得到搜索的结果
 // $scope.searchResult=function(e){
 //    var keycode=window.event?e.keyCode:e.which;
 //    if(keycode==13){
 //      $state.go('search',{description:$scope.searchKey});
 //    }
 //  };
  //清楚定时器的方法
  $scope.$on("$destroy",
    function(event){
       $interval.cancel($scope.timer);
    }
  );
  //新增多条件搜索
  $scope.business=0;
  $scope.address=[1,2,3];
  $scope.category=[0,1,2,3,4,5,6,7];
  $scope.loadTag=false;
  $scope.page=0;
  $scope.goodsList=[];
  $scope.pushType=null;
  $scope.ticking=false;
  $scope.loadMore=function(){
     if($scope.loadTag){return};
     $scope.loadTag=true;
     $scope.ticking=true;
     if($scope.page==0){
       tip.load();
     }

       userInfo.scroll($scope.pushType,$scope.page).success(function(response){
         if(response.errno==0){
           var data=response.data.push;
           console.log(data);
           if(data.length==0){
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>已无更多商品");
           }
           for(var i=0;i<data.length;i++){
             function getDate(strDate) {
               var st = strDate;
               var a = st.split(" ");
               var b = a[0].split("-");
               var c = a[1].split(":");
               var date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
               return date;
             }
             data[i].updateTime=getDate(data[i].updateTime);
              var date=new Date(data[i].updateTime);
             data[i].updateTime=date.getMonth()+1+'-'+date.getDate();
             data[i].updateMini=date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
             $scope.goodsList.push(data[i]);
           }
           $scope.page++;
           $scope.loadTag=false;
           $scope.ticking=false;
           tip.hide();
         }else if(response.errno==400){
           window.location.href="/auth/xmu?redirect_uri=transaction";
         }

       });
  };
  $scope.pushGoods=function(){
    // tip.load();
    // $scope.page=0;
    // $scope.goodsList=[];
    // $scope.loadMore();
    // $('.body-container')[0].scrollTop=0;
    var myParams={
      'address':$scope.address,
      'category':$scope.category,
      'business':$scope.business,
      'description':$scope.description
    };
    $state.go('search',{myParams:myParams});
  };
  $scope.loadMore();
});
/*
  搜索结果的控制器
 */
myapp.controller('SearchCtrl',function($scope,$stateParams,userInfo,tip,table){
   $scope.address=$stateParams.myParams.address;
   $scope.category=$stateParams.myParams.category;
   $scope.business=$stateParams.myParams.business;
   $scope.description=$stateParams.myParams.description;
   $scope.page=0;
   $scope.goodsList=[];
   $scope.loadTag=false;
   $scope.ticking=false;
   tip.load();
   $scope.showBig=function(id){
     table.showBack();
     table.showCover();
     var myId=id.replace('/transaction/s','/transaction');
     $scope.bigPic=myId;
   };
   $scope.hideBig=function(){
      table.hideBack();
      table.hideCover();
   };
   $scope.loadMore=function(){
      if($scope.loadTag){return};
      $scope.loadTag=true;
      $scope.ticking=true;
      if($scope.page==0){
        tip.load();
      }

        userInfo.newScroll($scope.address,$scope.category,$scope.description,$scope.business,$scope.page).success(function(response){
           var data=response.data.commodity;
           if(data.length==0){
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>已无更多商品");
           }
           for(var i=0;i<data.length;i++){
             function getDate(strDate) {
               var st = strDate;
               var a = st.split(" ");
               var b = a[0].split("-");
               var c = a[1].split(":");
               var date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
               return date;
             }
             data[i].updateTime=getDate(data[i].updateTime);
              var date=new Date(data[i].updateTime);
             data[i].updateTime=date.getMonth()+1+'-'+date.getDate();
             data[i].updateMini=date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
             $scope.goodsList.push(data[i]);
           }
           $scope.page++;
           $scope.loadTag=false;
           $scope.ticking=false;
           tip.hide();
        });
   };
   $scope.loadMore();
   $scope.init=function(){
     $('.footer-bar a').removeClass('active');
     if($scope.goodsList.length==0){
        $('.search-container .right-panel .no-search').hide();
     }else{
        $('.search-container .right-panel .no-search').show();
     }
   };
   $scope.init();

   //收藏商品
    $scope.collect=function(id){
     $.get('/transaction/api/user/Collect',{commodityId:id,method:1},function(data){
       var data=JSON.parse(data);
       if(data.errno==0){
          tip.show("<span class='glyphicon glyphicon-heart' aria-hidden='true'></span>收藏成功");
       }else if(data.errno==405){
          tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请勿重复收藏");
       }
     });

 };

});
/*
  新增商品页面的控制器部分
 */
myapp.controller('AddCtrl',function($scope,tip,newGoods,userInfo,$state,$timeout){
  //获取用户信息，看用户信息是否已经完全补全
  $scope.anonymity=0;
  $scope.business=0;
  userInfo.isFull().success(function(response){
    if(response.errno==0){
      $scope.isFull=true;
      userInfo.contains('personal').success(function(response){
        $scope.seller=response.data;
      });
    }else{
      $scope.isFull=false;
    }
    if(response.errno==400){
       window.location.href="/auth/xmu?redirect_uri=transaction";
    }
    if(response.errno==401){
      $state.go('list');
      $('.footer-bar .add').children('span').removeClass('glyphicon-remove');
      $('.footer-bar .add').children('span').addClass('glyphicon-plus');
    }
  });
  $scope.myTag=true;
  $scope.showType=function(){
    $scope.myTag=!$scope.myTag;
    if($scope.myTag){
      $scope.business=0;
    }else{
      $scope.business=1;
    }
  };
  $scope.addSuccess=function(){
    //判断是否上传成功,如果不成功需要显示失败的原因
      var phoneType=/^1\d{10}$/;
      var isPhone=phoneType.test($scope.seller.phone);
      if(!isPhone){
         tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>手机格式错误")
      };
      if(isPhone){
          tip.load();
          if($scope.isFull){
             $.post('/transaction/api/user/Update',{
              username:$scope.seller.username,
              address:$scope.seller.address,
              wechat:$scope.seller.wechat,
              phone:$scope.seller.phone
            },function(data){
              var data=JSON.parse(data);
              if(data.errno==0)
              {
                if($scope.category!=null&&$scope.price!=null&&$scope.description!=null){
                $.post('/transaction/api/commodity/Launch',{
                  method:'insert',
                  category:$scope.category,
                  description:$scope.description,
                  pictureA:$scope.pictureA,
                  pictureB:$scope.pictureB,
                  price:$scope.price,
                  anonymity:$scope.anonymity,
                  business:$scope.business
                },function(data){
                  var data=JSON.parse(data);
                  if(data.errno==0){
                    $scope.category='';
                    $scope.description='';
                    $scope.imgId1='';
                    $scope.imgId2='';
                    $scope.pictureA='';
                    $scope.pictureB='';
                    $scope.price='';
                    $scope.anonymity=0;
                    tip.hide();
                    tip.show("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>发布成功");
                    $timeout(function(){
                      $state.go('list.myindex');
                    },1000);
                  }else{
                     tip.hide();
                     tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>发布失败");
                  }
              })

            }else{
              tip.hide();
              tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>商品信息不完整");
            }

              }
            });
          }else{
            tip.hide();
            tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请补全个人信息");
          }
      }

  };
 $scope.upImage1=function(){
     wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                $scope.imgId1 = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $('.my-goods-add-container .input-group .img img').eq(0).attr('src',$scope.imgId1);
                wx.uploadImage({
                    localId:$scope.imgId1.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips:1, // 默认为1，显示进度提示
                    success: function (res) {
                        $scope.pictureA = res.serverId; // 返回图片的服务器端ID
                    },
                    fail:function(res){
                      alert("上传失败");
                    }
                })
            },
            fail:function(){
              alert("选择图片失败");
            }
      });
 };
 $scope.upImage2=function(){
     wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                $scope.imgId2 = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $('.my-goods-add-container .input-group .img img').eq(1).attr('src',$scope.imgId2);
                wx.uploadImage({
                    localId:$scope.imgId2.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips:1, // 默认为1，显示进度提示
                    success: function (res) {
                        $scope.pictureB = res.serverId; // 返回图片的服务器端ID
                    },
                    fail:function(res){
                      alert("上传失败");
                    }
                })
            },
            fail:function(){
              alert("选择图片失败");
            }
      });
 };

})
/*
  我收藏的商品页面的控制器部分
 */
myapp.controller('CollectCtrl',function($scope,tip,table,userInfo){
    $scope.showBig=function(id){
      table.showBack();
      table.showCover();
      $scope.bigPic=id;
    };
    $scope.onsells=[];
    $scope.hideBig=function(){
      table.hideBack();
      table.hideCover();
    };
    $scope.noCollect=function(id){
      $.get('/transaction/api/user/Collect',{commodityId:id,method:0},function(data){
        var data=JSON.parse(data);
        if(data.errno==0){
           tip.show("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>取消成功");
           userInfo.contains('collect').success(function(response){
            $scope.onsells=response.data[0];
            $scope.downsells=response.data[1];
           });
        }else if(data.errno==405){
           tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请勿重复操作");
        }
      })

    };
    userInfo.isFull().success(function(response){
      if(response.errno==0){
         //获取我所发布的商品列表
         userInfo.contains('collect').success(function(response){
          response.data[0].forEach(function(data,index){
              function getDate(strDate) {
              var st = strDate;
              var a = st.split(" ");
              var b = a[0].split("-");
              var c = a[1].split(":");
              var date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
              return date;
            }
            data.updateTime=getDate(data.updateTime);
            var date=new Date(data.updateTime);
            data.updateTime=date.getMonth()+1+'-'+date.getDate();
            data.updateMini=date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
           });
           $scope.onsells=response.data[0];
         });
       //获取初始的用户信息
          userInfo.contains('personal').success(function(response){
            $scope.now_name=response.data.username;
            $scope.now_address=response.data.address;
            $scope.now_email=response.data.email;
            $scope.now_phone=response.data.phone;
            $scope.now_headUrl=response.data.headImgUrl;
          });
      }
      if(response.errno==401){
        $scope.modify();
      }
    });

    $scope.modify=function(){
        table.modify();
        $scope.user_name=$scope.now_name;
        $scope.user_address=$scope.now_address;
        $scope.user_email=$scope.now_email;
        $scope.user_phone=$scope.now_phone;

    };
    $scope.hide=function(){
        table.hide();
    }
    //修改和更新个人信息
    $scope.updateInfos=function(){
      //正则判断,邮箱格式以及手机格式
      var phoneType=/^1\d{10}$/;
      var isPhone=phoneType.test($scope.user_phone);
      if(!isPhone){
         tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>手机格式错误")
      };
      if(isPhone==true&&isEmail==true){
      $.post('/transaction/api/user/Update',{
        username:$scope.user_name,
        address:$scope.user_address,
        wechat:$scope.user_wechat,
        phone:$scope.user_phone
      },function(data){
        var data=JSON.parse(data);
        if(data.errno==0)
        {
           $scope.now_name=$scope.user_name;
           $scope.now_address=$scope.user_address;
           $scope.now_wechat=$scope.user_wechat;
           $scope.now_phone=$scope.user_phone;
           tip.show("<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>修改成功");
           table.hide();
        }
      })
      }

    };

})
/*
  我发布的商品页面的控制器部分
 */
myapp.controller('ListCtrl',function($scope,table,tip,userInfo,$state){

    userInfo.isFull().success(function(response){
      if(response.errno==0){
         //获取我所发布的商品列表
         userInfo.contains('commodity').success(function(response){
           response.data[0].forEach(function(data,index){
              function getDate(strDate) {
              var st = strDate;
              var a = st.split(" ");
              var b = a[0].split("-");
              var c = a[1].split(":");
              var date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
              return date;
            }
            data.updateTime=getDate(data.updateTime);
            var date=new Date(data.updateTime);
            data.updateTime=date.getMonth()+1+'-'+date.getDate();
            data.updateMini=date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
           });
           response.data[1].forEach(function(data,index){
              function getDate(strDate) {
              var st = strDate;
              var a = st.split(" ");
              var b = a[0].split("-");
              var c = a[1].split(":");
              var date = new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2]);
              return date;
            }
            data.updateTime=getDate(data.updateTime);
            var date=new Date(data.updateTime);
            data.updateTime=date.getMonth()+1+'-'+date.getDate();
            data.updateMini=date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
           });
           $scope.onsells=response.data[0];
           $scope.downsells=response.data[1];
         });
       //获取初始的用户信息
          userInfo.contains('personal').success(function(response){
            $scope.now_name=response.data.username;
            $scope.now_address=response.data.address;
            $scope.now_wechat=response.data.wechat;
            $scope.now_phone=response.data.phone;
            $scope.now_headUrl=response.data.headImgUrl;
          });
      }
      if(response.errno==400){
        window.location.href="/auth/xmu?redirect_uri=transaction";
      }
      if(response.errno==401){
        $scope.modify();
      }
    });
   $scope.modify=function(){
        table.modify();
        $scope.user_name=$scope.now_name;
        $scope.user_address=$scope.now_address;
        $scope.user_wechat=$scope.now_wechat;
        $scope.user_phone=$scope.now_phone;
    };
    $scope.hide=function(){
        table.hide();
    };
     //修改和更新个人信息
    $scope.updateInfos=function(){
      var phoneType=/^1\d{10}$/;
      var isPhone=phoneType.test($scope.user_phone);
      if(!isPhone){
         tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>手机格式错误")
      };
      if(isPhone==true){
      $.post('/transaction/api/user/Update',{
        username:$scope.user_name,
        address:$scope.user_address,
        wechat:$scope.user_wechat,
        phone:$scope.user_phone
      },function(data){
        var data=JSON.parse(data);
        if(data.errno==0)
        {
           $scope.now_name=$scope.user_name;
           $scope.now_address=$scope.user_address;
           $scope.now_wechat=$scope.user_wechat;
           $scope.now_phone=$scope.user_phone;
           tip.show("<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>修改成功");
           table.hide();
        }
      })
      }

    };
    $scope.goEdit=function(id){
      $state.go('edit',{commodityId:id});
    };
    //已经下架商品,不允许修改
    $scope.unsell=function(){
      tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>请先上架商品");
    }
    // 待售商品如何下架
    $scope.undercarriage=function(id){
      $.get('/transaction/api/commodity/Status',{commodityId:id,status:1},function(data){
        var data=JSON.parse(data);
        if(data.errno==0){
          tip.show("<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>下架成功");
          userInfo.contains('commodity').success(function(response){
            $scope.onsells=response.data[0];
            $scope.downsells=response.data[1];
          });
        }
      });
    };
    $scope.upcarriage=function(id){
      $.get('/transaction/api/commodity/Status',{commodityId:id,status:0},function(data){
        var data=JSON.parse(data);
        if(data.errno==0){
          tip.show("<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>上架成功");
          userInfo.contains('commodity').success(function(response){
            $scope.onsells=response.data[0];
            $scope.downsells=response.data[1];
          });
        }
      });
    };
})

//商品详细页的控制器
myapp.controller('EditCtrl',function($scope,$stateParams,userInfo,$state,tip,$timeout){
  $scope.goBack=function(){
     $state.go('list.myindex');
  };
  $scope.commodityId=$stateParams.commodityId;
  //获取用户的信息
  userInfo.isFull().success(function(response){
    if(response.errno==0){
      $scope.isFull=true;
      userInfo.contains('personal').success(function(response){
        $scope.seller=response.data;
      })
    }else{
      $scope.isFull=false;
    }
  });
  //获取商品信息
  $.get('/transaction/api/commodity/Detail',{commodityId:$scope.commodityId},function(data){
     var data=JSON.parse(data);
     $scope.goods=data.data;
     $scope.pictureA=$scope.goods.pictureA;
     $scope.pictureB=$scope.goods.pictureB;
  });
  //更新商品信息
  $scope.upImage1=function(){
     wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                $scope.imgId1 = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $('.my-goods-add-container .input-group .img img').eq(0).attr('src',$scope.imgId1);
                wx.uploadImage({
                    localId:$scope.imgId1.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips:1, // 默认为1，显示进度提示
                    success: function (res) {
                        $scope.pictureA = res.serverId; // 返回图片的服务器端ID
                    },
                    fail:function(res){
                      alert("上传失败");
                    }
                })
            },
            fail:function(){
              alert("选择图片失败");
            }
      });
   };
  $scope.upImage2=function(){
     wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                $scope.imgId2 = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $('.my-goods-add-container .input-group .img img').eq(1).attr('src',$scope.imgId2);
                wx.uploadImage({
                    localId:$scope.imgId2.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips:1, // 默认为1，显示进度提示
                    success: function (res) {
                        $scope.pictureB = res.serverId; // 返回图片的服务器端ID
                    },
                    fail:function(res){
                      alert("上传失败");
                    }
                })
            },
            fail:function(){
              alert("选择图片失败");
            }
    });
 };
  //保存修改信息，并且更新商品状态
  $scope.addSuccess=function(){
    //判断是否上传成功,如果不成功需要显示失败的原因
      var phoneType=/^1\d{10}$/;
      var isPhone=phoneType.test($scope.seller.phone);
      if(!isPhone){
         tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>手机格式错误")
      };
      if(isPhone){
          tip.load();
          if($scope.isFull){
             $.post('/transaction/api/user/Update',{
              username:$scope.seller.username,
              address:$scope.seller.address,
              wechat:$scope.seller.wechat,
              phone:$scope.seller.phone
            },function(data){
              var data=JSON.parse(data);
              if(data.errno==0)
              {
                if($scope.goods.category!=null&&$scope.goods.price!=null&&$scope.goods.description!=null){
                    $.post('/transaction/api/commodity/Launch',{
                      method:'update',
                      commodityId:$scope.commodityId,
                      category:$scope.goods.category,
                      description:$scope.goods.description,
                      pictureA:$scope.pictureA,
                      pictureB:$scope.pictureB,
                      price:$scope.goods.price,
                      anonymity:$scope.goods.anonymity,
                      business:$scope.goods.business
                    },function(data){
                      var data=JSON.parse(data);
                      if(data.errno==0){
                        $scope.category='';
                        $scope.description='';
                        $scope.imgId1='';
                        $scope.imgId2='';
                        $scope.pictureA='';
                        $scope.pictureB='';
                        $scope.price='';
                        tip.hide();
                        tip.show("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>发布成功");
                        $timeout(function(){
                          $state.go('list.myindex');
                        },1000);
                      }else{
                         tip.hide();
                         tip.show("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>发布失败");
                      }
                    })
                  }else{
                    tip.hide();
                    tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>商品信息不完整");
                  }

              }
            });
          }else{
            tip.hide();
            tip.show("<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>请补全个人信息");
          }
      }

  };


})
/*-------------------------------------------指令部分---------------------------*/

/*
  首页部分指令,焦点图轮播等
 */
myapp.directive('changeTag',function($state){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            ele.bind('click',function(){
                if($('.footer-bar .add .iconfont').hasClass('icon-guanbi')){
                    $('.footer-bar .add .iconfont').removeClass('icon-guanbi').
                    addClass('icon-tianjia')
                }
                $('.footer-bar a').removeClass('active');
                angular.element(this).addClass('active');
                $('.modify-container').hide();
                $('.back-ground').remove();
            })
        }
    }
});
myapp.directive('changeType',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            ele.bind('click',function(){
                $('.body-container .left-panel-nav li').removeClass('active');
                $(this).addClass('active');
            })
        }
    }
});
myapp.directive('changeAdd',function($state){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            ele.bind('click',function(){
                if($(this).children('i').hasClass('icon-tianjia')){
                    $(this).children('i').removeClass('icon-tianjia');
                    $(this).children('i').addClass('icon-guanbi');
                    $state.go('add');
                }
                else{
                    $(this).children('i').removeClass('icon-guanbi');
                    $(this).children('i').addClass('icon-tianjia');
                    if($('.footer-bar .index').hasClass('active')){
                        $state.go('index');
                    }
                    else{
                        $state.go('list');
                    }
                }

            })
        }
    }
});
/*
  首页指令——>角点图轮播切换滚动注意scope代表的是父控制器,可以使用和改变
  父控制器里面的变量
 */
myapp.directive('myScroll',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
             ele.bind('click',function(){
                var index=$(this).attr('index');
                $('.scroll-container  .tab li').removeClass('active');
                $(this).addClass('active');
                scope.index=index;
                if(index==1){
                    $('.scroll-container .scroll-infos').css('left','-100%');
                }
                else if(index==2){
                    $('.scroll-container .scroll-infos').css('left','-200%');
                }
                else if(index==3){
                    $('.scroll-container .scroll-infos').css('left','-300%');
                }else if(index==4){
                    $('.scroll-container .scroll-infos').css('left','-400%');
                }
             })
        }
    }
});
/*
 焦点图轮播,无限循环
 */

/*
 首页指令，重新写滚动加载指令
*/
myapp.directive('loadMore',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            //  ele.bind('scroll',function(){
            //    var scrollTop=$(this)[0].scrollTop;
            //    var scrollHeight=$(this)[0].scrollHeight;
            //    var clientHeight=$(this)[0].clientHeight;
            //    if((scrollTop+clientHeight+250)>=scrollHeight){
            //      scope.loadMore();
            //    }
            //  });
              ele.bind('scroll',onScroll);
              //页面的防抖
              function preload(){
                var scrollTop=ele[0].scrollTop;
                var scrollHeight=ele[0].scrollHeight;
                var clientHeight=ele[0].clientHeight;
                if((scrollTop+clientHeight+200)>=scrollHeight){
                  scope.loadMore();
                }
              }
              function onScroll(){
                 if(!scope.ticking) {
                   requestAnimationFrame(preload);
                 }
              }
             var elem=ele[0];
             var startY,endY,startTime,endTime;
             //设置了开始滑动时候的Y的坐标，以及停止滑动时候的坐标
             var speedDecay = 0.1;
             //速度的衰减量为0.05一次
             var lastMoveTime,secondLastMoveTime;
             var stopMoveInterval;
             var stopInertialMove=false;
             elem.addEventListener('touchstart',function(e){
               stopInertialMove=true;
               startY=e.touches[0].pageY;
               startTime=Date.now();
             });
             elem.addEventListener('touchmove',function(e){
               secondLastMoveTime=lastMoveTime;
               lastMoveTime=Date.now();
             });
             elem.addEventListener('touchend',function(e){
               endY=e.changedTouches[0].pageY;
               endTime=Date.now();
               if(secondLastMoveTime){
                 stopMoveInterval = endTime - secondLastMoveTime;
               }else{
                 stopMoveInterval = endTime - lastMoveTime;
               }
               //计算速度
               var speed=(endY-startY)/(endTime-startTime);
               console.log(speed,'速度');
               var speedAbs = Math.abs(speed)+1;
               function inertiaMove() {
                  if (speedAbs < 0 || stopInertiaMove) {
                    return;
                  }
                  if(speedAbs<1.5){
                    var distance = speedAbs * 5;
                  }else{
                    var distance = speedAbs * 20;
                  }

                   if (speed < 0) {
                      elem.scrollTop += distance;
                   }else{
                      elem.scrollTop -= distance;
                   }
                   speedAbs -= speedDecay;
                   setTimeout(inertiaMove, 10);
               }
               if (stopMoveInterval < 100) {
                 stopInertiaMove = false;
                 inertiaMove();
               }
             });

        }
    }
});
myapp.directive('loadShortMore',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
            // ele.bind('scroll',function(){
            //   var scrollTop=$(this)[0].scrollTop;
            //   var scrollHeight=$(this)[0].scrollHeight;
            //   var clientHeight=$(this)[0].clientHeight;
            //   if((scrollTop+clientHeight+250)>=scrollHeight){
            //     scope.loadMore();
            //   }
            // });
             ele.bind('scroll',onScroll);
             //页面的防抖
             function preload(){
               var scrollTop=ele[0].scrollTop;
               var scrollHeight=ele[0].scrollHeight;
               var clientHeight=ele[0].clientHeight;
               if((scrollTop+clientHeight+200)>=scrollHeight){
                 scope.loadMore();
               }
             }
             function onScroll(){
                if(!scope.ticking) {
                  requestAnimationFrame(preload);
                }
             }
             var elem=ele[0];
             var startY,endY,startTime,endTime;
             //设置了开始滑动时候的Y的坐标，以及停止滑动时候的坐标
             var speedDecay = 0.05;
             //速度的衰减量为0.05一次
             var lastMoveTime,secondLastMoveTime;
             var stopMoveInterval;
             var stopInertialMove=false;
             elem.addEventListener('touchstart',function(e){
               stopInertialMove=true;
               startY=e.touches[0].pageY;
               startTime=Date.now();
             });
             elem.addEventListener('touchmove',function(e){
               secondLastMoveTime=lastMoveTime;
               lastMoveTime=Date.now();
             });
             elem.addEventListener('touchend',function(e){
               endY=e.changedTouches[0].pageY;
               endTime=Date.now();
               if(secondLastMoveTime){
                 stopMoveInterval = endTime - secondLastMoveTime;
               }else{
                 stopMoveInterval = endTime - lastMoveTime;
               }
               //计算速度
               var speed=(endY-startY)/(endTime-startTime);
               var speedAbs = Math.abs(speed);
               function inertiaMove() {
                  if (speedAbs < 0 || stopInertiaMove) {
                    return;
                  }
                  var distance = speedAbs * 20;
                   if (speed < 0) {
                      elem.scrollTop += distance;
                   }else{
                      elem.scrollTop -= distance;
                   }
                   speedAbs -= speedDecay;
                   setTimeout(inertiaMove, 10);
               }
               if (stopMoveInterval < 100) {
                 stopInertiaMove = false;
                 inertiaMove();
               }
             });

        }
    }
});

myapp.directive('autoScroll',function($q,$interval){
   return{
    restrict:'A',
    link:function(scope,ele,attr){
        var left=parseInt($('.scroll-container .scroll-infos').css('left'));
        scope.timer=$interval(function(){
           $('.scroll-container  .tab li').removeClass('active');
           if(scope.index<5&&scope.index>0){
              $('.scroll-container .scroll-infos').animate({left:left*(scope.index)});
              $('.scroll-container .tab li').eq((scope.index)-1).addClass('active');
              scope.index++
           }else if(scope.index=0){

           }else if(scope.index=5){

              $('.scroll-container .scroll-infos').animate({left:left*(scope.index)},function(){
                 $('.scroll-container .scroll-infos').css('left',left);

              });
              $('.scroll-container .tab li').eq(0).addClass('active');
              scope.index=1;
           }
        },2000);
    }
   }
});
/*
  首页类型的展开和收起
 */
myapp.directive('togType',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
           ele.bind('click',function(){
              $('.body-container .left-panel-nav .nav').slideToggle();
              if(ele.html()=='分类'){
                ele.html('展开');
              }else{
                ele.html('分类')
              }
           })
        }
    }
})
/*
 首页部分切换淘二手和求购
*/
myapp.directive('changeBusiness',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
       $('.search-panel .title .type').addClass('no-active');
       $(this).removeClass('no-active');
       if($(this).html().trim()=='淘二手'){
         scope.business=0;
       }else{
         scope.business=1;
       }
      })
    }
  }
});
/*
首页部分地址筛选
*/
myapp.directive('changeAddress',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
        if($(this).hasClass('active')){
          $(this).removeClass('active')
        }else{
          $(this).addClass('active');
        }
        //循环得到地址的数组
        var templates=$('.type-container .place-type');
        scope.address=[];
        for(var i=0;i<templates.length;i++){
          if(templates.eq(i).hasClass('active')){
            scope.address.push(i+1);
          }
        }
      })
    }
  }
});
/*
 首页部分修改类别的筛选
*/
myapp.directive('changeCatalog',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
        if($(this).hasClass('active')){
          $(this).removeClass('active');
        }else{
          $(this).addClass('active');
        }
        //循环得到目录的数组
        var templates=$('.type-container .goods-type');
        scope.category=[];
        for(var i=0;i<templates.length;i++){
          if(templates.eq(i).hasClass('active')){
            scope.category.push(i)
          }
        }
      })
    }
  }
});
myapp.directive('showSearch',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
         if($(this).hasClass('search-type')){
            $(this).css('display','none');
            $('.search-panel .footer').css('display','block');
            $('.search-panel').animate({width:'250px'});
         }else{
          $('.search-type').css('display','block');
          $('.search-panel').animate({width:0});
          $('.search-panel .footer').css('display','none')
         }


      });
    }
  }
})
myapp.directive('changeMy',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
         $('.my-change-tag li').removeClass('active');
         $(this).addClass('active');
       });
    }
  }

});
/*
切换tab
 */
myapp.directive('changeTitle',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
       ele.bind('click',function(){
        $('.my-goods-add-header .title').removeClass('active');
        $(this).addClass('active');
       })
    }
  }
})
/*
  现实和隐藏联系方式等
 */
 /*
  收藏商品的指令
 */
myapp.directive('collectGoods',function(){
  return{
    restrict:'A',
    link:function(scope,ele,attr){
      ele.bind('click',function(){
        $(this).addClass('active');
        console.log($(this));
      });
    }
  }
});
myapp.directive('showLink',function(){
    return{
        restrict:'A',
        link:function(scope,ele,attr){
           ele.bind('click',function(){
             $(this).toggle();
           })
        }
    }
})
/*-------------------------------------服务service部分----------------------------*/
//提示部分的服务
myapp.service('tip',function($timeout){
    this.show=function(x){
        $('.tabs-container').append("<div class='tip-body'></div>");
        $('.tabs-container .tip-body').append(x);
        $timeout(function(){
           $('.tabs-container .tip-body').fadeOut();
        },1000)
    };
    this.load=function(){
       $('.img-load').show();
    };
    this.hide=function(){
       $('.img-load').hide();
    }
})
//这里需要显示的是修改用户信息的部分服务
myapp.service('table',function(){
   this.modify=function(){
    $('body').append("<div class='back-ground'></div>");
    $('.modify-container').show();
   };
   this.hide=function(){
    $('.modify-container').hide();
    $('.back-ground').remove();
   };
   this.showBack=function(){
    $('.back-ground-img').show()
  };
   this.hideBack=function(){
    $('.back-ground-img').hide();
  };
   this.hideCover=function(){
     $('.back-ground-container').hide();
   };
   this.showCover=function(){
     $('.back-ground-container').css('display','flex');
     $('.back-ground-container').css('justify-content','center');
     $('.back-ground-container').css('align-items','center');
   };
})
//上传新增的商品信息的服务
myapp.service('newGoods',function($http){
    this.upload=function(){
       $.http({

       })
    }
})
//获取用户的信息
myapp.service('userInfo',function($http){
   this.contains=function(method){
     // var promise=$http("http://test.novaxmu.cn/transaction/api/user/View",{method:'personal'});
     var promise=$http({
       method:'GET',
       url:'/transaction/api/user/View',
       params:{
        'method':method
       }
     });
     return promise;
   };
   this.isFull=function(){
     var promise=$http.get('/transaction/api/user/Check');
     return promise;
   };
   this.newScroll=function(address,category,description,business,page){

     var myParams={
      'description':description,
      'business':business,
      'page':page
     };
     if(category){
       for(var i=0;i<category.length;i++){
         var str='category'+'['+i+']';
         myParams[str]=category[i];
       }
     }
     if(address){
       for(var i=0;i<address.length;i++){
         var str='address'+'['+i+']';
         myParams[str]=address[i];
       }
     }
     var promise=$http({
       method:'GET',
       url:'/transaction/api/commodity/MultiSearch',
       params:myParams
     });
     return promise;

   };
   this.scroll=function(category,page){
     var promise=$http({
      method:'GET',
      url:'/transaction/api/commodity/Push',
      params:{
        'category':category,
        'page':page
      }
     });
     return promise;
   };
   this.area=function(address,page){
     var promise=$http({
      method:'GET',
      url:'/transaction/api/commodity/Push?method=address',
      params:{
        'address':address,
        'page':page
      }
     });
     return promise;
   };
   this.timeSelect=function(year,month,day,page){
     var promise=$http({
       method:'GET',
       url:'/transaction/api/admin/View',
       params:{
         'year':year,
         'month':month,
         'day':day,
         'page':page
       }
     });
     return promise;
   }
   this.search=function(description){
     var promise=$http({
      method:'GET',
      url:'/transaction/api/commodity/Search',
      params:{
        'description':description
      }
     });
     return promise;
   }
})
