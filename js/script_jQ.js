//JQurey 的两大优点：支持连缀（连多个函数作用在同一个对象上），隐式迭代
$(window).on('load',function(){        //触发load事件后执行的操作
	waterfall();                       //jQuery 有强大的选择器不用传入参数
	var dataInt={"data":[{"src":'image/1.jpg'},{"src":'image/2.jpg'},{"src":'image/3.jpg'},{"src":'image/4.jpg'}]};
	$(window).on('scroll',function(){
		if(checkScrollSlide1){
			$.each(dataInt.data,function(index1,value){
				//创建一个div 直接$('')代替decument.createElemnet
				//增加一个类   .addClass()代替oParent.appendChild()
				//appendTo() 加在哪个父元素下
				//attr()  里面加一个参数是用来获取属性，两个参数是设置属性
				//value是js原生对象不可用jQuery的库需要转换 
				//注意不要拼错了英文
				var oBox=$('<div>').addClass('box').appendTo($('#main'));
				var oPic=$('<div>').addClass('pic').appendTo($(oBox));
				var Img=$('<img>').attr('src',$(value).attr('src')).appendTo($(oPic));
				//console.log(oPic)
			})
			waterfall();
		}
	})
   checkScrollSlide1();
})
//'#选择器'(ID)，Id是唯一元素（其中class可以是多个）
function waterfall(){     
	var $boxs=$('#main>div');           //只寻找一级子元素，若是 空格+div 则会使得寻找多级子元素
	//var w=$boxs.eq(0).width();        //.eq()第几个元素  .width 仅仅是图片的宽度 
	var w=$boxs.eq(1).outerWidth();     //.outerWidth是包括图片 填充和boder等在内的
	console.log(w);
	var column=Math.floor($(window).width()/w);  
	//$('#main').width(column*w).css('margin:0px auto;border: 2px solid red');//不可以
	$('#main').width(column*w).css({
		'margin':'0 auto',
		'border':'2px solid red'
	});     //width()可获取(括号内不填);可设置（填设置值且不需要单位px）
	var hArr=[];
	//.each遍历元素 可代替for,遍历获取的索引和 每个box的div元素(不可以使用jquery的任何方法)
	//但是又要设置样式的话需要css方法，用方法的前提是jquery对象，加$可以将其转换成jquery对象
	$boxs.each(function(index,value){
		//console.log(index);
		var h=$boxs.eq(index).outerHeight();
		if(index<column){
			hArr[index]=h;
			//hArr.push(h);    //or 
		}else{
			var Hmin=Math.min.apply(null,hArr);
			var HminIndex=$.inArray(Hmin,hArr);           //掉用函数inArray(一个值出现在数组中的索引)
			//错误$boxs.eq(index).top=$boxs.eq(HminIndex).offsetHeight;
			$(value).css({
				'position':'absolute',                 
				'top':Hmin+'px',
				'left':$boxs.eq(HminIndex).position().left+'px' //与原生Script的调用offsetLeft不同
			    // or//'left':$boxs.eq(HminIndex).offset().left+'px'
			})
			hArr[HminIndex]+=$boxs.eq(index).outerHeight();
			//console.log($boxs.eq(HminIndex).position().left);
		}
	})
}

function checkScrollSlide1(){
	var $lastBox=$('#main>div').last();
	var lastBoxH=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
	var scrollTop=$(window).scrollTop();
	var documentH=$(window).height();
	//console.log(lastBoxH);
	//console.log(scrollTop+documentH);
	return (lastBoxH<(scrollTop+documentH))?true:false;
}