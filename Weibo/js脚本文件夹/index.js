$(function () {
    //导航条的显示和隐藏
    $(window).scroll(function(){
        //获取滚动条的距离
        let scroll=$(document).scrollTop();
        //如果滚动条距离大于200px，就让导航条显示
        if (scroll>200) {
            $('#nav').slideDown(600);
        }else{
            $('#nav').slideUp(600);
        }
    })
    //搜索框得到焦点时
    $('.nav-center-search input').focus(function () {
        //出现下拉框
        $('.nav-center-search .content').show();
        //颜色改变
        $('.nav-center-search .content .linshi').css('color','#ff8200')
    })
    //搜索框失去焦点时
    $('.nav-center-search input').blur(function () {
        //下拉框消失
        $('.nav-center-search .content').hide();
        //颜色变回
        $('.nav-center-search .content .linshi').css('color','#000')
    })   
    
    //点击切换白天黑夜
    $('.nav-center-sun').click(function() {
        $('.nav-center-sun').toggleClass('icon-yueliang');
    })
    
    //请求导航条接口数据
    $.ajax({
        url:"https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/nav",//请求的接口地址
        type:"get",//请求方式是get   请求方式分为get/post
        success:function (res) {
            //console.log(res);
            for (let i = 0; i < res.data.length-1; i++) {
                //对数据进行拼接汇总
                let oDiv='<div>'+res.data[i]+'</div>';
                //console.log(oDiv);
                //往.main-top里插入节点
                $(".main-top").append(oDiv);
            }
            //为最后一个class类名的数据单独进行拼接汇总
            let oIcon='<div class="iconfont icon-quanbu"></div>';
            //也往.main-top里插入节点
            $(".main-top").append(oIcon);
            //console.log(oIcon);
        },
        //如果请求失败了
        error:function (err) {
            console.log('请求失败');
        }

    })


    //请求微博热搜接口数据
    $.ajax({
        url:"https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/hotsearch",//请求的接口地址
        type:"get",//请求方式是get   请求方式分为get/post
        success:function (res) {
            //console.log(res);
            //根据number字段数量大小进行排列热搜
            function objSort(prop) {
                return function(obj1,obj2){
                    var val1=obj1[prop];
                    var val2=obj2[prop];
                    //强转函数？强制转换成Number
                    if(!isNaN(Number(val1))&&!isNaN(Number(val2))){
                        val1=Number(val1);
                        val2=Number(val2);
                    }
                    if(val1<val2){
                        return 1;
                    }else if(val1>val2){
                        return -1;
                    }else{
                        return 0;
                    }
                }
            }
            let oArr=res.hotsearch.sort(objSort("number"));
            //console.log(oArr);
            //将排序好的热搜数据遍历输出到页面中
            for (let i = 0; i < oArr.length; i++) {
                
                let iconNember="icon-zhiding";;
                if (i>0){
                    iconNember="icon-"+i;
                };
                //对数据进行拼接汇总
                let oDiv=`
                <div class="hot">
                    <div class="iconfont ${iconNember}"></div>
                    <div class="title" style="text-align: left;">${oArr[i].title}</div>
                    <div>${oArr[i].number}</div>
                    <div>${oArr[i].icon}</div>
                <div>
                `;
                //往.main-right-hotsearch里插入节点
                $('#main .main-right-hotsearch').append(oDiv);
            }
            
            //为最后一个class类名的数据单独进行拼接汇总???
            //let oIcon='<div class="'+res.data[res.data.length-1]+'"></div>';
            let oIcon=`<div class="complete">查看完整热搜榜单</div>`;
            //也往.main-top里插入节点
            $('#main .main-right-hotsearch').append(oIcon);

        },
        //如果请求失败了
        error:function (err) {
            console.log('请求失败');
        }

    })
    

    //无限滚动加载博文数据
    $.ajax({
        url:"https://www.fastmock.site/mock/e190dfd2c2243661705bbe24d1d0ed3f/api/article",//请求的接口地址
        type:"get",//请求方式是get   请求方式分为get/post
        success:function (res) {
            //console.log(res);

            loadArticle();
            //监听滚动条事件，把每次到底数据加载五条
            window.addEventListener('scroll',function(){
                var timer;//使用闭包缓存变量
                var startTime=new Date();
                return function(){
                    var curTime=new Date();
                    if (curTime-startTime>=2000) {
                        timer=setTimeout(function () {
                            loadArticle();
                        },500);
                        startTime=curTime;
                    }
                }
            }());//自执行函数
            //数据的分割函数
            function loadArticle(){
                //拿到所有文章信息
                let articleArr=res.article;
                //console.log(articleArr);
                //每次从开头截取5条信息
                let fiveArr=articleArr.splice(0,5);
                for (let i = 0; i < fiveArr.length; i++) {
                    //将数据遍历到节点上
                    let articleElement=
                    `
                    <div class="main-bottom">
                        <div class="main-bottom-blog">
                            <div class="title">
                                <div class="title-img">
                                    <img src="${res.article[i].imgUrl}">
                                    <span class="iconfont icon-renzheng"></span>
                                </div>
                                <div class="title-name">
                                    <div class="title-name-top">
                                        <span>${res.article[i].name}</span>  
                                        <span class="iconfont ${res.article[i].icon1}"></span>
                                        <span class="iconfont ${res.article[i].icon2}"></span>
                                        <span class="iconfont ${res.article[i].icon3}"></span>
                                    </div>
                                    <div class="title-name-hour">
                                        2小时之前
                                    </div>
                                    <div class="title-name-show">
                                        ${res.article[i].sign}
                                    </div>
                                </div>
                                <div class="title-name-focus">
                                    <span class="iconfont icon-jiahao1">关注</span>      
                                </div>
                            </div>
                            <div class="media">
                                <div>${res.article[i].content}</div>
                                <img src="${res.article[i].image1}">
                                <img src="${res.article[i].image2}">
                                <img src="${res.article[i].image3}">
                                <img src="${res.article[i].image4}">
                                <img src="${res.article[i].image5}">
                                <img src="${res.article[i].image6}">
                            </div>
                            <div class="share">
                                <div class="iconfont icon-zhuanfa">${res.article[i].share}</div>
                                <div class="iconfont icon-pinglun">${res.article[i].message}</div>
                                <div class="iconfont icon-good">${res.article[i].give}</div>
                            </div>
                        </div>
                    </div>
                    `
                    $(".main-bottom-template").append(articleElement);
                    
                }
            }
        },
        //如果请求失败了
        error:function (err) {
            console.log('请求失败');
        }

    })
    //左侧固定
    $(window).scroll(function(){
        //获取滚动条的距离
        let scroll=$(document).scrollTop();
        //
        let mainLeft=document.getElementsByClassName("main-left");
        //如果滚动条距离大于200px，就让导航条显示
        if (scroll>200) {
            mainLeft[0].style.position="fixed";
            mainLeft[0].style.left="195px";
            mainLeft[0].style.top="60px";
        }else{
            mainLeft[0].style.position="";
            mainLeft[0].style.left="";
            mainLeft[0].style.top="";
        }
    })
    //右侧固定
    $(window).scroll(function(){
        //获取滚动条的距离
        let scroll=$(document).scrollTop();
        //
        let mainRight=document.getElementsByClassName("main-right");
        //如果滚动条距离大于200px，就让导航条显示
        if (scroll>530) {
            mainRight[0].style.position="fixed";
            mainRight[0].style.left="1035px";
            mainRight[0].style.top="-290px";
        }else{
            mainRight[0].style.position="";
            mainRight[0].style.left="";
            mainRight[0].style.top="";
        }
    })
})




