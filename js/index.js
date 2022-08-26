window.onload = function(){

    //路径导航数据渲染
    function navPathDataBind(){
        //获取路径导航DOM节点
        var navPath = document.getElementById('navPath');
        //获取动态数据
        var path = goodData.path;
        //动态产生DOM元素节点
        for(var i = 0; i < path.length; i++)
        {
            //在遍历数据创建DOM节点时，最后一条只创建a标签
            if(i == path.length - 1)
            {
                //创建a标签
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                //navPath元素追加a
                navPath.appendChild(aNode);
            }
            else
            {
                //创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;
                //创建i标签
                var iNode = document.createElement("i");
                iNode.innerText = "/";
                //navPath元素追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    };
    navPathDataBind();

    //放大镜的移入移出效果
    function bigClassBind(BigImgSrc){
        //获取小图框元素对象并设置移入事件
        var smallPic = document.getElementById("smallPic");
        smallPic.onmouseenter = function(){
            //动态创建蒙版和大图
            var maskDiv = document.createElement("div");
            maskDiv.className = "mask";
            var bigPicDiv = document.createElement("div");
            bigPicDiv.id = "bigPic";
            //创建大图片
            var BigImg = document.createElement("img");
            //初始化路径
            if(!BigImgSrc)
            {
                BigImg.src = "./images/b1.png";
            }
            else{
                BigImg.src = BigImgSrc;//该参数用于配合缩略图动态渲染
            }
            //追加元素
            this.appendChild(maskDiv);
            bigPicDiv.appendChild(BigImg);
            this.parentNode.appendChild(bigPicDiv);
            
            //设置移动事件
            this.onmousemove = function(event){ 
                //通过计算得出蒙版坐标 
                //getBoundingClientRect()距离浏览器窗口的位置
                //offsetWidth/offsetHeight 在父元素中占位宽高
                //这里用event.offsetX - getComputedStyle()去计算会出bug
                var maskLeft = event.clientX - 
                this.getBoundingClientRect().left -
                maskDiv.offsetWidth/2;
                var maskTop = event.clientY - 
                this.getBoundingClientRect().top -
                maskDiv.offsetHeight/2;
                
                //蒙版边界控制
                if(maskLeft < 0)
                {
                    maskLeft = 0;
                }
                else if(maskLeft > this.clientWidth - maskDiv.offsetWidth)
                {
                    maskLeft = this.clientWidth - maskDiv.offsetWidth;
                }
                //这里使用连续的else if就会出bug
                if(maskTop < 0)
                {
                    maskTop = 0;
                }
                else if(maskTop > this.clientHeight - maskDiv.offsetHeight)
                {
                    maskTop = this.clientHeight - maskDiv.offsetHeight;
                }
                //为蒙版设置坐标
                maskDiv.style.left = maskLeft + "px";
                maskDiv.style.top = maskTop + "px";

                //移动比例
                var scale = (this.clientWidth - maskDiv.offsetWidth) / 
                (BigImg.offsetWidth - bigPicDiv.clientWidth);
                //为大图片设置坐标
                BigImg.style.left = (- maskLeft) / scale + "px";
                BigImg.style.top = (- maskTop) / scale + "px";
                
            }


            //移出时移除蒙版元素和大图
            this.onmouseleave = function(){
                this.removeChild(maskDiv);
                this.parentNode.removeChild(bigPicDiv);
            };
        };
    };
    bigClassBind();

    //动态渲染缩略图数据
    function thumbnailData(){
        //获取picList中的ul
        var ul = document.querySelector("#wrapper #center #left #leftBottom #picList ul");
        //获取data.js中的goodData中的imagessrc
        var imagessrc = goodData.imagessrc;
        //遍历数组，根据数组长度创建li
        for(var i = 0; i < imagessrc.length; i++)
        {
            //创建li和img
            var Li = document.createElement("li");
            var Img = document.createElement("img");

            //为img添加src和alt
            Img.src = imagessrc[i].s;
            Img.alt = "Loading failed!";

            //ul追加li和img
            Li.appendChild(Img);
            ul.appendChild(Li);
        }
    };
    thumbnailData();

    //点击缩略图的效果
    function clickThumbnail(){
        //获取缩略图元素全部li
        var Li = document.querySelectorAll("#wrapper #center #left #leftBottom #picList ul li");
        //获取data.js中的goodData中的imagessrc
        var imagessrc = goodData.imagessrc;
        //遍历数组
        for(var i = 0; i < Li.length; i++)
        {
            //保存下标
            Li[i].index = i;
            //为li绑定单击响应事件
            Li[i].onclick = function(){
                //获取点击事件对应元素的下标
                var idx = this.index;
                //获取小图
                var smallPicImg = document.querySelector("#wrapper #center #left #leftTop #smallPic img");
                //更改小图路径
                smallPicImg.src = this.childNodes[0].src;
                //更改大图路径
                bigClassBind(goodData.imagessrc[idx].b);
            };
        }
    };
    clickThumbnail();

    //点击左右箭头效果
    function clickArrow(){
        //获取箭头元素
        var prevArrow = document.querySelector("#wrapper #center #left #leftBottom .prev");
        var nextArrow = document.querySelector("#wrapper #center #left #leftBottom .next");
       
        //获取div元素及ul、li
        var picList = document.querySelector("#wrapper #center #left #leftBottom #picList");
        var picListUl = document.querySelector("#wrapper #center #left #leftBottom #picList ul");
        var picListLi = document.querySelectorAll("#wrapper #center #left #leftBottom #picList ul li");
       
        //计算
        var start = 0;
        var liStyle = getComputedStyle(picListLi[0]);
        var step = (picListLi[0].offsetWidth + parseInt(liStyle["margin-right"]))*2;
        var end = (step/2)*picListLi.length - parseInt(getComputedStyle(picList).width);
        //为箭头绑定单击响应事件
        nextArrow.onclick = function(){
            start += step;
            if(start > end)
            {
                start = end;
            }
            picListUl.style.left = -start + "px";
        };
        prevArrow.onclick = function(){
            start -= step;
            if(start < 0)
            {
                start = 0;
            }
            picListUl.style.left = -start + "px";
        };
    };
    clickArrow();

    //商品详情数据动态渲染
    function rightTopData(){
        //获取rightTop元素
        var rightTop = document.querySelector("#wrapper #center #right .rightTop");

        //获取Data.js中的goodData->goodsDetail
        var goodsDetail = goodData.goodsDetail;

        //建立一个字符串变量，替换原来的布局结构，将对应数据放在对应位置
        var s = `
        <h3>${goodsDetail.title}</h3>
        <p>${goodsDetail.recommend}</p>
        <div class="priceWrap">
            <div class="priceTop">
                <span>Price</span>
                <div class="price">
                    <span>￥</span>
                    <p>${goodsDetail.price}</p>
                    <i>Price Reduction Notification</i>
                </div>
                <p>
                    <span>
                        Cumulative evaluation
                    </span>
                    <span>
                        ${goodsDetail.evaluateNum}
                    </span>
                </p>
            </div>
            <div class="priceBottom">
                <span>Sales Promotion</span>
                <p>
                    <span>${goodsDetail.promoteSales.type}</span>
                    <span>${goodsDetail.promoteSales.content}</span>
                </p>
            </div>
        </div>
        <div class="support">
            <span>Support</span>
            <p>${goodsDetail.support}</p>
        </div>
        <div class="address">
            <span>Delivered to</span>
            <p>${goodsDetail.address}</p>
        </div>
        `;

        //重新渲染righTop
        rightTop.innerHTML = s;
    };
    rightTopData();

    //商品参数动态渲染
    function rightBottomData(){
        //获取chooseWrap元素
        var chooseWrap = document.querySelector("#wrapper #center #right .rgihtBottom .chooseWrap");
        
        //获取Data.js中的goodData->crumbData
        var crumbData = goodData.goodsDetail.crumbData;

        //动态创建dl、dt、dd，将对应数据放入
        for(var i = 0; i < crumbData.length; i++)
        {
            var dl = document.createElement("dl");
            var dt = document.createElement("dt");
            dt.innerText = crumbData[i].title;
            dl.appendChild(dt);
            chooseWrap.appendChild(dl);
            for(var j = 0; j < crumbData[i].data.length; j++)
            {
                var dd = document.createElement("dd");
                dd.innerText = crumbData[i].data[j].type;
                dd.setAttribute("price", crumbData[i].data[j].changePrice);//定义一个属性以便于后续封装价格变动函数
                if(!j)
                {
                    dd.style.color = "red";//第一个选项默认设为红色
                }
                dl.appendChild(dd);
            }
        }
    };
    rightBottomData();

    //点击商品参数之后的颜色排他效果
    function clickDdBind(){
        //获取dl
        var dl = document.querySelectorAll("#wrapper #center #right .rgihtBottom .chooseWrap dl");
        
        //点击dd后产生mark标记
        //创建一个可以容纳所有dd的容器(数组)，确定数组起始长度
        var arr = Array(dl.length);
        arr.fill(0);//初始化数组，填充0

        //获取choose
        var choose = document.querySelector("#wrapper #center #right .rgihtBottom .choose"); 
        //遍历dl数组
        for(var i = 0; i < dl.length; i++)
        {
            //利用闭包解决事件中的变量问题
            (function(i){
                //获取dd元素
                var dd = dl[i].querySelectorAll("#wrapper #center #right .rgihtBottom .chooseWrap dl dd");
                
                //遍历dd
                for(var j = 0; j < dd.length; j++)
                {                    
                    dd[j].onclick = function(){
                        //先将其他元素的颜色设为默认
                        for(var k = 0; k < dd.length; k++)
                        {
                            dd[k].style.color = "#666666"; 
                        }
                        //再设置当前元素的颜色
                        this.style.color = "red";

                        //清空choose元素
                        choose.innerHTML = "";
                        
                        //dd值按照对应下标写入数组元素(产生mark)
                        arr[i] = this;
                        changePriceBind(arr);
                        //遍历数组，将非0元素写入mark
                        arr.forEach(function(value, index){
                            //为真的条件动态创建mark
                            if(value)
                            {
                                var mark = document.createElement("div");
                                mark.id = "mark";
                                var markA = document.createElement("a");
                                markA.innerText = "X";
                                markA.setAttribute("index", index);//设置下标
                                markA.href = "javascript:;";
                                mark.innerText = value.innerText;
                                mark.appendChild(markA);
                                choose.appendChild(mark);
                            }
                        });
                        //获取所有a标签，并循环发生点击事件
                        var markAs = document.querySelectorAll("#wrapper #center #right .rgihtBottom .choose #mark a")
                        for(var n = 0; n < markAs.length; n++)
                        {
                            markAs[n].onclick = function(){
                                //获取a身上的index
                                var idx = this.getAttribute("index");

                                //获取所有mark
                                //var marks = document.querySelectorAll("#wrapper #center #right .rgihtBottom .choose #mark");
                                //移除对应mark
                                //choose.removeChild(marks[idx]);
                                //以上代码块有报错的bug

                                //移除数组中对应文本
                                arr[idx] = 0;
                                changePriceBind(arr);
                                
                                //查找a对应的dd元素组
                                var ddList = dl[idx].querySelectorAll("dd");
                                //遍历数组，将字体颜色设置为默认
                                for(var m = 0; m < ddList.length; m++)
                                {
                                    //这里length打成了lenght，导致for循环进不去，
                                    //找了半天的bug，关键是控制台不报错，人麻了
                                    ddList[m].style.color = "#666666";
                                }

                                //删除对应下标位置的mark
                                choose.removeChild(this.parentNode);
                            };
                        }
                    };
                } 

            })(i);
        }
        

    };
    clickDdBind();

    //价格变动函数
    function changePriceBind(arr){
        //获取价格元素
        var oldPrice = document.querySelector("#wrapper #center #right .rightTop .priceWrap .priceTop .price p");
        //给每个dd加一个自定义属性，记录价格变化
        //遍历arr，将dd上变化的价格与已有价格相加
        var price = goodData.goodsDetail.price;
        for(var i = 0; i < arr.length; i++){
            if(arr[i])
            {
                var changePrice = Number(arr[i].getAttribute("price"));
                price += changePrice;
            }
        };
        oldPrice.innerText = price;
        
        //联动商品详情区价格变化
        //获取商品详情区初始价格元素
        var initPrice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p");
        initPrice.innerText = "￥" + price;

        //遍历选择搭配中所有复选框
        var checkBoxs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li div input");
        //若复选框选中则加上套餐价
        for(var j = 0; j < checkBoxs.length; j++)
        {
            if(checkBoxs[j].checked)
            {
                price += Number(checkBoxs[j].value);
            }
        }
        //没有选中则为初始价格
        var packPrice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i");
        packPrice.innerText = "￥" + price;

    };

    //选择搭配复选框套餐价格变动效果
    function choosePrice(){
        //获取复选框元素
        var checkBoxs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li div input");
        //获取套餐价元素
        var packPrice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i");
        //获取初始价格元素
        var initPrice = document.querySelector("#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p");
        //遍历复选框绑定响应事件
        for(let i = 0; i < checkBoxs.length; i++)
        {
            checkBoxs[i].onclick = function(){
                var oldPrice = Number(initPrice.innerText.slice(1));
                for(let j = 0; j < checkBoxs.length; j++)
                {
                    if(checkBoxs[j].checked)
                    {
                        //新的价格 = 旧的价格 + 复选框附加价格
                        oldPrice += Number(checkBoxs[j].value);
                    }
                }
                packPrice.innerText = "￥" + oldPrice;
            };
        }
    };
    choosePrice();

    //封装一个公共选项卡函数
    //tabBtns 被点击元素
    //tabConts 被点击切换元素
    //使用es6语法的let来实现块级作用域
    function Tab(tabBtns, tabConts){
        for(let i = 0; i < tabBtns.length; i++)
        {
            tabBtns[i].onclick = function(){
                //初始化所有选项
                for(let j = 0; j < tabBtns.length; j++)
                {
                    tabBtns[j].className = tabConts[j].className = "";
                }
                //设置当前元素
                this.className = tabConts[i].className = "active";
            }
        }
    };

    //点击左侧选项卡
    function leftCard(){
        //获取被点击的元素
        var h4s = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4");
        //获取相应内容
        var divs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideContent >div");

        //调用选项卡函数
        Tab(h4s, divs);
    };
    leftCard();

    //点击右侧选项卡
    function rightCard(){
        //获取被点击的元素
        var lis = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail #bottomDetail .tabBtns li");

        //获取相应内容
        var divs = document.querySelectorAll("#wrapper #content .contentMain .goodsDetailWrap .rightDetail #bottomDetail .tabContents div");
        
        //调用选项卡函数
        Tab(lis, divs);

    };
    rightCard();

    //右边侧边栏点击效果
    function rightAsideBind(){
        //获取按钮
        var btn = document.querySelector("#wrapper .rightAside .btn");

        //记录初始状态
        var flag = true;
        
        //点击事件
        btn.onclick = function(){
            if(flag)
            {
                //展开
                btn.className = "btn btnOpen";
                btn.parentNode.className = "rightAside asideOpen";
            }
            else
            {
                //关闭
                btn.className = "btn btnClose";
                btn.parentNode.className = "rightAside asideClose";

            }
            //改变状态
            flag = !flag;
        };

    };
    rightAsideBind();
};