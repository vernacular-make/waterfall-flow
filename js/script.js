/*
	案例:爆布流(网页图片布置，淘宝物品浏览界面)
	 1：高度是自动伸缩，宽度固定
	 2：定位布局，讲究就改变每个元素的top和left位置即可
	 3：间距设定(图片之间)			
	 4: 拖动滚动条使得图片加载至当前页面的尾部（是否触发事件）
*/
window.onload=function(){                            //页面加载的时候，需要执行的脚本
	waterfull('main','box');                         //封装函数，操作对象是  父盒子main  子盒子box
	//模拟后台数据信息
	var dataInt={"data":[{"src":'image1/1.jpg'},{"src":'image1/2.jpg'},{"src":'image1/3.jpg'}]};
	//在window界面触发的,onscroll当拖动滚动条的时候且具备;加载数据块的条件会触发发事件（页面偏离浏览器页面顶部的情况）
	//条件：最后一个数据块显示一半的时候加载新数据块（不唯一但和最后一个数据块有关），新的数据块来自后台
    window.onscroll=function(){    
		  if(checkScrollSlide){   
			  var oParent = document.getElementById('main');
			  //将数据渲染到当前页面尾部
			  for(var i=0;i<dataInt.data.length;i++){
			   var oBox=document.createElement('div');
			   oBox.className='box';
			   oParent.appendChild(oBox);
			   var oPic=document.createElement('div');
			   oPic.className='pic';
			   oBox.appendChild(oPic);
			   var oImg=document.createElement('img');
			   oImg.src=dataInt.data[i].src;
			   oPic.appendChild(oImg);
			   }
			   waterfull('main','box');  //将新加入的图片显示在它该出现的位置
		  } 
	}                                   
}
function waterfull(parent,box){
	//将main下的所有class为box的元素取出来
	var oParent=document.getElementById(parent);     //取main元素
	var oBoxs=getByclass(oParent,box);               //取父元素下哪些class元素
	
	//获取盒子宽度 
	var oBoxW=oBoxs[0].offsetWidth;
	console.log(oBoxs[0].offsetHeight);         //奇怪的是和下面的输出不一样
	
	//列数
	var column=(Math.floor(innerWidth/oBoxW))  
	//var column=Math.floor(document.documentElement.clientWidth/oBoxW); //表达一样均可以使用
	         
	//设置main的宽
	oParent.style.cssText='width:'+oBoxW*column+'px;margin:0px auto;border: 2px solid red';
	
	//获取box高度(先定一行，再解决下一张图片加载在哪里，下一张图片要加在一行最矮的图片下面,
	//每次增加的图片高度将刷新该行加在其对应最矮图片的高度，刷新数组，再重新比较放新的图片)
	var hAr=[];
    console.log(oBoxs[0].offsetHeight);             //奇怪的是和上面的输出不一样
	for (var i=0;i<oBoxs.length;i++) {
		if(i<column){
		hAr.push(oBoxs[i].offsetHeight);
		}else{
			 var minH=Math.min.apply(null,hAr);     //求数组元素的最小值 apply
			 var index=getMinIndex(hAr,minH);
			 
			 //改变盒子的定位 绝对定位
			 oBoxs[i].style.position='absolute';
			 oBoxs[i].style.top=minH+'px';       
			 
			 oBoxs[i].style.left=oBoxs[index].offsetLeft+'px';
			 //oBoxs[i].style.left=oBoxW*index+'px'; //该表示好像会有问题，问题出现在当index是0的时候，是0px但其实是15px
			 hAr[index]+=oBoxs[i].offsetHeight; 
		}
    }
}

//根据class获取元素  (是一个数组)
function getByclass(parent,clsName){
	var boxArr=new Array();    //用来存储获取的所有class为box的元素
	    oElements=parent.getElementsByTagName('*');  //依据标签获取父元素的元素 '*'表示任意标签*/
		for(var i=0;i<oElements.length;i++){
		   if(oElements[i].className==clsName){
			   boxArr.push(oElements[i]);
		   }
		}
	return boxArr;
}

//获取最小高度的索引
function getMinIndex(arr,value){
	for (var i in arr){
		if (arr[i]==value){
			return i;
		}
	}
}

//检测是否具备了滚动条加载数据库的条件  返回boolean类型值
function checkScrollSlide(){
	var oParent=document.getElementById("main");
	var oBoxs=getByclass(oParent,'box');
	var lastBoxH=oBoxs[oBoxs.length-1].offsetTop+Math.floor(oBoxs[oBoxs.length-1].offsetHeight/2);
	console.log(lastBoxH);
	//滚走的距离+浏览器的高度距离
	var scrollTop=document.body.scrollTop || document.documentElement.scrollTop ;  //混杂模式和标准模式选一个，解决兼容问题
	var winheight=document.body.clientHeight || document.documentElement.clientHeight;
	return (lastBoxH<scrollTop+winheight)? true:false;
}
