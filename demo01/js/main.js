var snTemai = snTemai || {};
snTemai = {
	cityBox:function(){
		var city = $("#citybox");
		var btn,isopen = false,ref, cityc,offset,poffset, active = false, timeout;
		var url = 'data/city.html';
		var nowprovince = "";
		var onChange;
		return {
			init: function(fn) {
				onChange = fn || (function(cname) {/*alert(cname)*/})
				if (city.length == 0) {
					return;
				}
				ref = this;
				btn = $("#citybox_btn").click(function(e) {
					if(city.css('display')=="none"){
						$(this).addClass('select');
						city.show();
						$('.citychoosebox').addClass('citybox-open');
					}else{
						$(this).removeClass('select');
						$('.citychoosebox').removeClass('citybox-open');
						city.hide();
					}
					e.preventDefault();
				})
				city.mouseover(function(){
					$(this).show();
					$("#citybox_btn").addClass('select');
					$("#citybox_btn02").addClass('select');
				}).mouseleave(function(){
					$(this).hide();
					$("#citybox_btn").removeClass('select');
					$("#citybox_btn02").removeClass('select');
					$('.citychoosebox').removeClass('citybox-open');
				});

				city.find("table a").click(function(e) {
					ref.x=parseInt($(this).offset().left-$(".province").offset().left);
					ref.y=parseInt($(this).offset().top-$(".province").offset().top);
					e.preventDefault();
					if (cityc != null) {
						cityc.remove();
						cityc = null;
					}
					active = false;
					clearTimeout(timeout);
					nowprovince = this.innerHTML;
					poffset = $(this).offset();
					var _this=this;
					(function() {
						var randomparam = Math.floor(Math.random() * 1000000);
						var qp = _this.name;
						if (qp == '9017' || qp == '9264' || qp == '9281' || qp == '9325') {
							setTimeout(function() {
								$("#citybox_btn").removeClass('select');
								city.hide();
								$("#citybox_btn").removeClass('select');
								city.css({
									"height": "auto"
								});
								$("#temp_iframe").remove();
							}, 300);
							$('#citybox_btn .ctext').html(nowprovince);
							e.preventDefault();
						} else {
							$.get(url, function(data) {
								ref.addCity(data, $(_this).parent());
							});
						}
					})();
					city.find("table a").css({"z-index":0,"position":"relative"});
					$(this).css("z-index",100000);
					$(this).css("position","relative");
					if(_this.name=='') {
						$(this).addClass('on').parent().parent().siblings().find('a').removeClass('on');
						$(this).addClass('on').parent().siblings().find('a').removeClass('on');
						$(this).addClass('on').siblings().removeClass('on');
					}
				}).mouseleave(function(e) {
					timeout = setTimeout(function() {
						if (!active && cityc != null) {
							cityc.remove();
							$(".province").find('a').removeClass('on');
							cityc = null;
							city.css({"height":"auto"});
						}
					},200)
				});
				/* close */
				city.find(".closeIco").click(function(event){
					city.hide();
					event.preventDefault();
				});
			},
			changeView: function() {
				city.css("display", isopen ? "none" : "block");
				if (!offset && !isopen) {
					offset = city.offset();
				}
				isopen = !isopen;
			},
			addCity: function(str,obj) {
				var re = /([A-Za-z]+)([0-9]+)(.[^\|]+)()/g;
					var o = {}
					var code={}
					var cityH = city.height();
					while(r = re.exec(str)) {
						if (!o[r[1]]) {
							o[r[1]] = [r[3]];
							code[r[1]] = [r[2]];
						} else {
							o[r[1]].push(r[3]);
							code[r[1]].push(r[2]);
						}
					}
					var loc = 0;
					var template = '<table class="citys"><tr>';
					for (var i in code) {
						var temp = "";
						var temparr = o[i];
						var temparrValue = code[i];
						for (var j=0 ;j<temparr.length; j++) {
							temp += '<a name=' + temparrValue[j] +' href="#">' + temparr[j] + '</a>'
						}
						template += '<td class="td03">' + temp + '</td>';
						template += "</tr><tr>";
						loc++;
					}
					template = template.substring(0, template.length-4) + "</table>";
					cityc = $(template);
					city.append(cityc);
					if(this.y+cityc.height()+30 < cityH){
						city.css("height",cityH);
					}else{
						city.css({"height":this.y+cityc.height()+30});
					}
					cityc.mouseover(function(e) {
						active = true;
					}).mouseleave(function(e) {
						active = false;
						cityc.remove();
						cityc = null;
						city.css({"height":"auto"});
						$(".province").find('a').removeClass('on');
					});
					cityc.find("a").click(function(e) {
						setTimeout(function(){
							city.hide();
							$("#citybox_btn").removeClass('select');
							$("#citybox_btn02").removeClass('select');
							city.css({"height":"auto"});
						},300);
						$('#citybox_btn .ctext').html(this.innerHTML);
						$('#citybox_btn02').html(this.innerHTML);
						e.preventDefault();
					});
					cityc.css({left:10+"px" ,top:this.y+20+"px" });
			}
		}
	},
	//鼠标滑过效果
	bannerHover:function(o,cls){
		o.live('mouseover',function(){
			$(this).addClass(cls).siblings().removeClass(cls);
			if($(this).hasClass('selling')){
				$(this).children('.brand-notice').show();
			}
		})
		o.live('mouseleave',function(){
			if($(this).hasClass('selling')){
				$(this).children('.brand-notice').hide();
			}
		})
	},
	floorHover:function(o,cls){
		o.hover(
			function(){
				var _this = $(this);
				_this.addClass(cls).siblings().removeClass(cls);
				_this.find('.brand-time').children('span').addClass(cls);
				if(_this.hasClass('brand-selling') || _this.hasClass('selling')){
					_this.children('.brand-notice').show();
					/*_this.children('.brand-notice').children('.notice-btn').unbind('click');
					_this.children('.brand-notice').children('.notice-btn').bind('click',function(){
						$(this).siblings('.error').css({'display':'block'});
					})*/
				}
			},
			function(){
				var _this = $(this);
				_this.removeClass(cls);
				_this.find('.brand-time').children('span').removeClass(cls);
				if(_this.hasClass('brand-selling') || _this.hasClass('selling')){
					_this.children('.brand-notice').hide();
				}
			}
		)
	},
	//品牌页li移上效果
	brandLi:function(){
		$('.brandlist').find('li').hover(
			function(){
				$(this).addClass('cur');
				if($(this).children('.itembox').hasClass('willstart')){
					$(this).find('.brand-notice').show();
				}
			},
			function(){
				$(this).removeClass('cur');
				if($(this).children('.itembox').hasClass('willstart')){
					$(this).find('.brand-notice').hide();
				}
			}
		)
		/*$('.brandlist').find('.notice-btn').click(function(){
			$(this).siblings('.error').css({'display':'block'});
		})*/
	},
	//所有的开售提醒按钮点击事件
	noticeAct:function(){
		var btn = $('.notice-btn');
		btn.click(function(){
			//$(this).parent().parent('li');//通过这个找到父级的li，然后传值。。。
			$(this).siblings('.error').css({'display':'block'});
		})
	},
	//首页顶部点击滚动效果
	slideAct:function(opt){
		var dfp = {id:'',lbtn:'',rbtn:''};
		$.extend(dfp,opt);
		var w = 1000;//parseFloat($(dfp.id).parent().css('width'))+10;
		var step = 0,max = 0;
		max = parseFloat($(dfp.id).attr('max'));
		dfp.rbtn.unbind('click');
		dfp.lbtn.unbind('click');
		if(max == 1){
			dfp.rbtn.addClass('nfalse').css({'cursor':'default'});
			dfp.lbtn.addClass('pfalse').css({'cursor':'default'});
			return false;
		}else{
			dfp.rbtn.removeClass('nfalse');
			dfp.lbtn.removeClass('pfalse');
		}		
		dfp.rbtn.hover(
			function(){
				$(this).addClass('next-on');
			},
			function(){
				$(this).removeClass('next-on');
			}
		);
		dfp.lbtn.hover(
			function(){
				$(this).addClass('prev-on');
			},
			function(){
				$(this).removeClass('prev-on');
			}
		);
		dfp.rbtn.css({'cursor':'pointer'}).bind('click',function(){
			if(!$(dfp.id).is(':animated')){
				$(dfp.id).css({'position':'absolute'});
				max = parseFloat($(dfp.id).attr('max'));
				step ++;
				$(dfp.id).animate({'left':-w*(step+1)},500,function(){
					if(step == max){
						step = 0;
						$(dfp.id).css({'left':-w*(step+1)});
					}
					$(dfp.id).attr('step',step);
				});
			}
		});
		dfp.lbtn.css({'cursor':'pointer'}).bind('click',function(){
			if(!$(dfp.id).is(':animated')){
				$(dfp.id).css({'position':'absolute'});
				max = parseFloat($(dfp.id).attr('max'));
				step --;
				$(dfp.id).animate({'left':-w*(step+1)},500,function(){
					if(step == -1){
						step = max-1;
						$(dfp.id).css({'left':-w*(step+1)});
					}
					$(dfp.id).attr('step',step);
				});
			}
		})
	},
	//输入框事件
	inputEvent:function(o,str,tip){
		$(o).unbind('focus');
		$(o).unbind('keyup');
		$(o).unbind('blur');
		$(o).bind('focus',function(){
			if($(this).val()==str){
				$(this).val('');
			}
			$(this).css({'color':'#333'});
			$(this).siblings(tip).hide();
		})
		$(o).bind('keyup',function(){
			if($(this).val() == '' || $(this).val()==str){
				$(this).css({'color':'#bbb'}).val(str);
			}
		})
		$(o).bind('blur',function(){
			if($(this).val() == '' || $(this).val()==str){
				$(this).css({'color':'#bbb'}).val(str);
			}
		})
	},
	/*右侧电梯*/
	sideBar:function(){
		var tabs = $(".right-nav");
		if(tabs.length == 0){return false;}
		if( tabs.size()==0 ){
			return false;
		}
		$('.back-top').hide();
		var ieVersion = ($.browser.msie)?$.browser.version:false, //判断浏览器类型版本
			topHide = $(document).scrollTop(); //页面上部被卷去高度
		var h = tabs.height();
		tabs.css({'top':$(window).height() - h - 100,'right':30});
		$(window).scroll(function(){
			topHide = $(document).scrollTop();
			if(topHide > 0){
				$('.back-top').show();
				if( ieVersion && parseInt(ieVersion)<=6 && topHide > 0){
						tabs.css({
							'position' : "absolute",
							'top' : $(window).height() - h + topHide - 100,
							'right' : 30
						});
				}else{
					tabs.css({
						position : "fixed",
						top : $(window).height() - h - 100,
						right : 30
					});
				}
			}else{
				tabs.css({'top':$(window).height() - h - 100,'right':30});
				$('.back-top').hide();
			}
			
		});
		$(window).resize(function(){
			tabs.css({'top':$(window).height() - h - 100,'right':30});
		})
		$('.back-top').click(function(){
			if(!$('html,body').is(':animated')){
				$('html,body').animate({'scrollTop':0},200);
			}
		})
	},
	//查看图片
	viewBigImg:function(){
		var delay;
		var i = 0;
		var box = $("#preView_box");
		if(box.length == 0){return false;}
		box.find("li").mouseover(function(){
			var _this = $(this);
			delay = setTimeout(function(){
				_this.children('a').addClass("cur");
				_this.siblings().children('a').removeClass("cur");
				$("#PicView").find("img").attr("src",_this.find("img").attr("src"));
			},200);
			
		}).mouseout(function(){
			clearTimeout(delay);
		});

		var up = $("#preView_box").find("p.thl");
		var down = $("#preView_box").find("p.thr");
		var len = $("#preView_box").find("li").length;
		if(len < 5){up.addClass("false")};
		var ol = $("#preView_box").find("ol");
		if(len <= 5){
			len = 5;
			return;
		}
		down.click(function(){
			i++;
			if(i >= len - 5){
				i = len - 5;
			}
			move(i);
		})

		up.click(function(){
			i--;
			if(i <= 0){
				i = 0;
			}
			move(i);
		})
		
		function move(i){
			if(!ol.is(":animated")){
				ol.stop(true).animate({"margin-left" : -65 * i});
			}
		}
	},
	//数量微调
	buyCount:function(){
		var obj = $('.numbox'),
		input = obj.find('input'),
		add = obj.find('.add'),
		red = obj.find('.reduce'),
		tip = $('.max-tip');
		if(obj.length == 0){return false;}
		var reg = /^[1-9][0-9]{0,}$/;
		var n,max,num,_this = this;
		function condition(){
			num = parseFloat(input.val());
			if(num==1){
				red.addClass('no-reduce');
				if(add.hasClass('no-add')){
					add.removeClass('no-add')
				}
			}else if(num == max){
				add.addClass('no-add');
				if(red.hasClass('no-reduce')){
					red.removeClass('no-reduce')
				}
			}else{
				if(add.hasClass('no-add')){
					add.removeClass('no-add')
				}
				if(red.hasClass('no-reduce')){
					red.removeClass('no-reduce')
				}
			}
		}
		function init(){
			if(input.attr('maxnum')){
				max = parseFloat(input.attr('maxnum'));
				tip.show().children('i').text(max);
			}else{
				max = 99;
			}
			var _this = this;
			condition()
			add.click(function(e){
				num = parseFloat(input.val());
				if(num<max){
					num++;
				}
				input.val(num);
				condition();
			});
			red.click(function(){
				num = parseFloat(input.val());
				if(num>1){
					num--;
				}
				input.val(num);
				condition();
			});
			input.focus(function(){
				n = parseFloat(input.val());
			});
			input.click(function(){
				if(!reg.test(input.val())){
					input.val(n);
				}
			});
			input.bind('keyup blur',function(){
				if(!reg.test(input.val())){
					input.val(n);
				}else{
					if(parseFloat(input.val())>max){
						input.val(max)
					}
					if(parseFloat(input.val())<1){
						input.val(1);
					}
					n = parseFloat(input.val());
					condition();
				}
			});
		}
		init();
	},
	/*typechoose 类型选择*/
	typeChoose:function(){
		var obj = $('.paralist');
		if(obj.length == 0){return false;}
		obj.find('a').click(function(){
			$(this).addClass('cur').siblings().removeClass('cur');
		});
	},
	/*通知好友气泡*/
	callFriend:function(){
		var obj = $('.tellbox');
		if(obj.length == 0){return false;}
		var pop = obj.children('.pop-tip');
		var	sendBtn = pop.find('a'),
			input = pop.find('input'),
			testF = false;
		obj.find('.callf').click(function(){
			pop.show();
		});
		sendBtn.click(function(){
			if(!testF){
				pop.removeClass('success').addClass('error').find('.tips').show().html("<i></i>请输入正确的手机号码！");
				testF = !testF;
			}else{
				pop.removeClass('error').addClass('success').find('.tips').show().html("<i></i>短信已发送成功,通知到您的好友");
				testF = !testF;
			}
		});
		var time;
		pop.mouseleave(function(){
			clearTimeout(time);
			var _this = $(this);
			time = setTimeout(function(){
				_this.hide();
				pop.removeClass('success').removeClass('error').find('.tips').hide();
			},200)
		});
		snTemai.inputEvent(input,'请输入手机号码','i');//这里第三个随便写个非a的标签，比如span、i
	},
	/*tab切换浮动效果*/
	slideTabs:function(){
		var tabs = $(".float-pack");
		if( tabs.size()==0 ){
			return false;
		}
		var ieVersion = ($.browser.msie)?$.browser.version:false, //判断浏览器类型版本
			tabsWrap = $(".brand-tab-box"),
			tabsWrapTop = tabsWrap.offset().top, //tab标签容器距页面顶端距离
			tabsWrapLeft = tabsWrap.offset().left, //tab标签容器距页面左端距离
			topHide = $(window).scrollTop();//页面上部被卷去高度
		$(window).scroll(function(){
			tabsWrapTop = tabsWrap.offset().top;
			tabsWrapLeft = tabsWrap.offset().left;
			topHide = $(window).scrollTop();
			if(topHide > tabsWrapTop){
				tabs.css({'border':'1px solid #DDD'});
				if( ieVersion && parseInt(ieVersion)<=6 ){
					tabs.css({
						position : "absolute",
						left : tabsWrapLeft,
						top : topHide
					});
					$('.top-toolbox').css({
						position : "absolute",
						left : tabsWrapLeft,
						top : topHide + 40,
						zIndex:100
					})
				}else{
					tabs.css({
						position : "fixed",
						top : 0,
						left : tabsWrapLeft
					});
					$('.top-toolbox').css({
						position : "fixed",
						top : 40,
						left : tabsWrapLeft,
						zIndex:100
					});
				}
			}else{
				tabs.removeAttr("style");
				$('.top-toolbox').removeAttr("style");
			}
		})
	},
	/**
	 *	商品购买页面参数部分tab
	 *	tab:			事件句柄
	 *	contentBox:		内容容器
	 *	toTop:			是否点击之后定位到顶部
	 */
	buySigleTab:function(tab,tag,contentBox,toTop){
		var con = contentBox;
		var top = 0;
		tab.find(tag).click(function(){
			$(this).addClass('cur').siblings().removeClass('cur');
			con.children().hide().eq($(this).index()).show();
			top = tab.offset().top;
			if(toTop){
				$('html,body').animate({'scrollTop':top},100);
			}
		})
	},
	/*同品牌商品推荐*/
	moveAnimate:function(){
		var box = $('.samebrandbox').children('ul');
		if($('.samebrandbox').length==0){return false;}
		var max = box.children().length/4;
		var width = 980;
		var rbtn = $('.rpbtn'),lbtn = $('.lpbtn');
		if(box.children().length<=3){return false;}
		var head=[],last=[];
		for(var i=0;i<4;i++){
			head.push(box.children().eq(i).clone());
		}
		for(var i=11;i>7;i--){
			last.push(box.children().eq(i).clone());
		}
		for(var i=0;i<4;i++){
			last[i].insertBefore(box.children('li:first'));
			head[i].insertAfter(box.children('li:last'));
		}
		box.css({'width':245*box.children().length});
		var step = 0;
		box.css({'left':-1*width});
		$('.mbl,.lpbtn').click(function(){
			if(!box.is(':animated')){
				step--;
				if(step==-2){
					step = max - 2;
				}
				move(step);
			}
		})
		$('.mbr,.rpbtn').click(function(){
			if(!box.is(':animated')){
				step++;
				if(step==max + 1){
					step = 1;
				}
				move(step);
			}
		})
		function move(t){
			box.stop(true,true).animate({'left':-1*(t+1)*width},300,function(){
				if(t==-1){
					t = max - 1;
					box.css({'left':-1*max*width});
				}else if(t == max){
					t = 0;
					box.css({'left':-1*width});
				}
				$('.same-tabbox').find('p').children('span').removeClass('cur').eq(t).addClass('cur');
			});
		}
		var time;
		$('.same-tabbox').find('p').children('span').mouseover(function(){
			var _this = $(this);
			clearTimeout(time);
			setTimeout(function(){
				_this.addClass('cur').siblings().removeClass('cur');
				step = _this.index();
				move(step);
			},200);
		})
	},
	//排序
	orderAct:function(){
		var obj = $('.order-box');
		obj.find('a').click(function(){
			if(!$(this).hasClass('cur')){
				$(this).addClass('cur')
			}
			$(this).find('i').toggleClass('cur')
			
		})
	}
}
snTemai.paraPop = function(){
	var _obj = $(".pro-para-table").find(".Imgpip");
	var _helpBtn = _obj.find('b');
	var _pop = _obj.find(".pipOut");
	var _popclose = _pop.find("a");
	_helpBtn.bind({
		mouseover:function(){
			$(this).addClass("hover");
		},
		mouseout:function(){
			_helpBtn.removeClass("hover");
		},
		click:function(){
			_pop.hide();
			$(this).parent().css({'z-index':110});
			$(this).siblings('.pipOut').show();
			_popclose.bind("click",function(){
				_pop.hide();
				$(this).parents('.Imgpip').css({'z-index':101});
			});
		}
	});
}
$(function(){
	snTemai.paraPop();
	snTemai.orderAct();
	snTemai.noticeAct();//开售提醒
	snTemai.moveAnimate();
	snTemai.sideBar();
	snTemai.cityBox().init();
	snTemai.bannerHover($('.banner-list').find('li'),'on');
	snTemai.floorHover($('.brand-content').find('li'),'on');
	snTemai.floorHover($('.good-list').find('li'),'on');
	snTemai.floorHover($('.active').find('li'),'on');
	snTemai.inputEvent($('.phone-email'),'输入手机号码/邮箱地址','span');
	snTemai.viewBigImg();
	snTemai.buyCount();
	snTemai.cityBuyBox().init();
	snTemai.typeChoose();
	snTemai.brandLi();
	snTemai.slideTabs();
	snTemai.callFriend();
	/*品牌页面tab，首页不用该方法*/
	snTemai.buySigleTab($('.allbrandtab'),'li',$('.brand-contentbox'),true);
	snTemai.buySigleTab($('.detailtabbox'),'li',$('.brand-contentbox'),true);
	/*评价tab*/
	snTemai.buySigleTab($('.judge-subtab'),'dd',$('.judge-type-box'),false);
	/*特卖首页顶部切换*/
	ECode.tab({
		selector:'#time-sell-tab',
		selected:'on',
		callback:function(id){
			/*$('#time-sell-tab').find("li[rel='#"+id+"']").removeClass('on').children('a').addClass('on').end().siblings().removeClass('on').children('a').removeClass('on');
			var box = $('#'+id);
			var index = box.index();
			box.css({'left':-1000});
			var len = box.children().length;
			if(!(!!box.attr('added'))){
				//复制节点，无缝滚动
				box.attr('max',Math.floor(len/4));
				var lastNode = [],fNode=[];
				for(var i = len-1;i>len - 5;i--){
					var temp = box.children().eq(i).clone().removeClass('on');
					lastNode.push(temp);
				}
				for(var i=0;i<4;i++){
					var temp = box.children().eq(i).clone().removeClass('on');
					fNode.push(temp);
				}
				for(var i=0;i<4;i++){
					lastNode[i].insertBefore(box.children().eq(0));
					box.append(fNode[i]);
				}
				box.css({'left':-1*parseFloat(box.parent().width()+10)});
			}
			snTemai.slideAct({
				id:'#'+id,
				lbtn:$('.banner-main').find('.prev'),
				rbtn:$('.banner-main').find('.next')
			});
			box.attr('added',true);*/
			/*场次*/
			//$('.time-dis').children().hide().eq(index).show();
		}
	});
    test();
	/*即将开卖tab*/
	ECode.tab({
		selector:'#dayTab',
		selected:'cur',
		callback:function(id){
			var obj = $('#dayTab').find("li[rel='#"+id+"']")
			var totalpage = obj.attr('totalpage');
			var id1 = obj.attr('id1');
			var id2 = obj.attr('id2');
		}
	});
	/*特卖首页tab*/
	ECode.tab({
		selector:'#soc-sell-tab',
		selected:'cur',
		callback:function(id){
			var index = $('#soc-sell-tab').find("li[rel='#"+id+"']").index();
			$('#float-nav-tab').children().eq(index).addClass('on').siblings().removeClass('on');
		}
	});
	/*右侧浮动tab*/
	ECode.tab({
		selector:'#float-nav-tab',
		selected:'on',
		callback:function(id){
			var index = $('#float-nav-tab').find("li[rel='#"+id+"']").index();
			$('#soc-sell-tab').children().eq(index).addClass('cur').siblings().removeClass('cur');
		}
	});
	/*点击右侧浮动后，滚动到tab处，此处无法放到tab回调中，否则页面加载即跳到tab处*/
	$('#float-nav-tab').find('a').click(function(){
		if(!$('html,body').is(':animated')){
			$('html,body').animate({'scrollTop':$('.sell-main').position().top},100);
		}
	});
	//列表倒计时
	//renderClocks($('.time-span111'));
	//三个时间段倒计时
	//spiketTimeH('leftTime1',10700000,10700000,'i');
	//spiketTimeH('leftTime2',10700000,10700000,'i');
	//spiketTimeH('leftTime3',10700000,10700000,'i');
	//品牌页面
	//spiketTimeH('qLeftTime',10700000,10700000,'i');
	//购买页面
	//spiketTimeH('leftTimeDetail',10700000,10700000,'b');
	timeDown('#leftTime1','11:36:40','20:01:00');
})
function unixtime(d){
	var time = new Date(d);
	return(time.getTime());
}
/*这个是购买商品时的城市选择，上面的是顶部的城市*/
snTemai.cityBuyBox = function() {
    //城市切换总控制元素
    var city = $("#bcitybox"), //初始不可见包裹容器
        cityBtn = $("#bcitybox_btn"), //初始可见城市选择
        cityData = $("#bcityData"), //省、市、区数据载入容器
        pArea = city.find(".chooseArea").find("p"); //选择省市元素
    var ref; //this
    var cb = null;
    return {
    	//
        init: function(callback) {
        	if(arguments.length > 0){
        		cb = callback;
        	}
            ref = this;
            //激活选择省面板，toggle功能
            cityBtn.click(function(e) {
                if(city.css('display')=="none" || city.hasClass("hide")){
                    $(this).addClass('select');
                    city.removeClass("hide").show();
                    //fix for ie6
                    if($.browser.msie && ($.browser.version == "6.0")){
                    	cityData.css("zoom", 1)
                    }    
                }else{
                    $(this).removeClass('select');  
                    city.hide().addClass("hide");
                }
                e.stopPropagation();                           
                e.preventDefault();
            })
			city.click(function(e){
				e.stopPropagation();
			})
			$("body").click(function(){
				if(city.css('display') == "block"){
					ref.reset();
				}
	            return;
			});
			//内部省市区切换
            pArea.click(function(){
            	var index = $(this).index();
            	if($(this).hasClass("disable")){
            		return;
            	}
            	$(this).addClass("cur").siblings().removeClass("cur");
            	city.find(".arriveBox").show();
            	cityData.find("table").eq(index).show().siblings().hide();
            	if($("#temp_iframe").length > 0){
            		$("#temp_iframe").height(city[0].offsetHeight);
            		//return;
            	}
            	//fix for ie6 select
            	if($.browser.msie && ($.browser.version == "6.0") && $("#temp_iframe").length < 1){
                    var iframe = document.createElement("iframe");
                    iframe.id = "temp_iframe";
                    city.after(iframe);
                    $(iframe).css({
                        width : city.width(),
                        height : city[0].offsetHeight,
                        position : "absolute",
                        "z-index" : 10,
                        opacity : 0,
                        top : 25, // 微调数据
                        left : 75  //微调数据
                    });
                }
                if($(this).hasClass("loaded")){
                	return;
                }
                ref.getAjaxData($(this).attr("data-url"));
            });
            this.choose();
        },
        /**
         * [choose description]
         * 选择省市区
         */
        choose: function(){
        	var pCur;
        	var p1 = pArea.eq(0), p2 = pArea.eq(1), p3 = pArea.eq(2);
        	//绑定方式后期优化
        	cityData.find("a").click(function(e){
	        	pCur = city.find(".chooseArea").find("p.cur").index();
            	e.preventDefault();
            	if(this.href.indexOf("javascript") > -1){
            		alert("很抱歉，西藏目前无法送达");
            		return;
            	}
            	//直辖市
            	if($(this).attr("data-city") == "true"){
            		p1.text($(this).text());
            		p2.text($(this).text()).addClass("disable");
            		p3.addClass("cur").text('请选择区县').siblings().removeClass("cur").attr("data-url", $(this).attr("href"));
            		cityData.find("table").eq(2).show().siblings().hide();
            		ref.getAjaxData(this.href);
            		return;
            	}
            	//其他省条件判断
            	if(pCur == 0){
            		p2.text('请选择市').addClass("disable").attr("data-url", $(this).attr("href"));
            		p3.text('请选择区县').addClass("disable");
            	}
            	//市条件判断
            	if(pCur == 1){
            		p3.attr("data-url", $(this).attr("href"));
            	}
            	//最后一步区县
            	if(pCur == 2){
            		/**
            		 * 最后执行回调作用域
            		 */
            		p3.text($(this).text());
            		if(pArea.eq(1).hasClass("disable")){
            			cityBtn.find(".ctext").text('');
            		}else{
            			cityBtn.find(".ctext").text(p2.text());
            		}
            		cityBtn.find(".ptext").text(p1.text());
			        cityBtn.find(".atext").text(p3.text());
            		ref.reset();
            		alert("你选择了 [" +pArea.eq(0).text()+pArea.eq(1).text()+pArea.eq(2).text() + "]. 城市选择操作展示完毕！");
            		if(typeof cb == "function"){
            			//内可以传参
            			cb(this.innerHTML);
            		}
            		return;
            	}
            	ref.getStatus(pArea,pCur,$(this).text());
            	ref.getAjaxData(this.href);
            });
        },
        //省市区层级自动切换
        getStatus: function(_this,i,text){
			_this.eq(i+1).addClass("cur").siblings().removeClass("cur");
        	cityData.find("table").eq(i+1).show().siblings().hide();
        	_this.eq(i).text(text);
    	},
    	//异步获取省市区的数据
    	//数据源格式定义为
    	//C9183常州市||H9181淮安市||L9182连云港市||N9173南京市||N9177南通市||S9176苏州市||S9185宿迁市||T9184泰州市||W9174无锡市||X9180徐州市||Y9178扬州市||Y9179盐城市||Z9175镇江市 
        getAjaxData: function(url) {
        	var index = city.find(".chooseArea").find("p.cur").index();
        	if(index == 0){
		    	return;
		    }
	        var re = /([A-Za-z]+)([0-9]+)(.[^\|]+)()/g;
	        var arr = []  //
	        var s = null; //
	        var template = '<tr>';
		    cityData.find("table").eq(index).html('<tr><td>加载中...</td></tr>');
	        $.get(url, function(data) {
	        	while(s = re.exec(data)) {
	                //print_r >> ["Z9175镇江市", "Z", "9175", "镇江市", ""]
	                arr.push([s[2],s[3]]);
	            }
	            for(var i = 0;i<arr.length; i++){
	            	if(i%4 == 0 && i != 0){
	            		template = template + '</tr><tr>';
	            	}
	                template += '<td><a href="data/' + arr[i][0] + '.html">' + arr[i][1] + '</a></td>';
	            }
	            template = template + '</tr>';
	    		cityData.find("table").eq(index).html(template);
	    		cityData.find("a").unbind("click");
	    		ref.choose();
	           	pArea.eq(index).removeClass("disable").addClass("loaded");
	           	$("#temp_iframe").height(city[0].offsetHeight);
	        });
        },
        //初始化
        reset: function(){
            city.hide();
	        $("#temp_iframe").remove();
	        cityBtn.removeClass('select');
	        pArea.removeClass("cur");
	        cityData.hide();
	        cityData.find("table").hide();
	        //fix for ie6
	        if($.browser.msie && ($.browser.version == "6.0")){
            	cityData.css("zoom", 0)
            }
        }
    }
}
/*tab切换公用方法*/
var ECode = ECode || {};
ECode.tab = function (options) {
    var def = {selector:null, start:0, event:"click", delay:150, selected:".selected", callback:$.noop};
    var args = arguments[0];
    if (!args || !(typeof(args) == "object" && Object.prototype.toString.call(args).toLowerCase() == "[object object]" && !args.length)) {
        return $.error("ECode.tab: 参数必须为JSON格式")
    }
    $.extend(def, options);
    def.selected = def.selected.replace(/^\./, "");
    var tab = function (idArray, tagRel, handle) {
        tagRel.removeClass(def.selected);
        handle.addClass(def.selected);
        $(idArray.join(",")).hide();
        var thisTagRel = handle.attr("rel");
        $(thisTagRel).show();
        def.callback.apply(this, [thisTagRel.split('#')[1]])
    };
    var tabWrap = $(def.selector);
    var numIndex = !!(typeof def.start === "number");
    tabWrap.each(function () {
        var T = $(this);
        var _id = [], container, display, tagRel = T.children("[rel^='#']");
        if (tagRel.size() == 0) {
            return true
        }
        tagRel.removeClass(def.selected);
        for (var i = 0; i < tagRel.length; i++) {
            var rel = tagRel.eq(i).attr("rel");
            _id.push(rel);
            if (numIndex && def.start == i) {
                display = $(rel);
                tagRel.eq(i).addClass(def.selected)
            }
        }
        if (!numIndex) {
            display = $(def.start);
            T.children("[rel^='" + def.start + "']").addClass(def.selected)
        }
        container = $(_id.join(","));
        container.not($(display)).hide();
        display.show();
        def.callback.apply(this, [display.attr("id")]);
        var timer, isDelay = (/^mouseover|mouseout|mouseleave|mouseenter$/.test(def.event));
        if (!isDelay) {
            def.delay = 15
        }
        tagRel.bind(def.event, function () {
            var _this = $(this);
            var thisTagRel = _this.attr("rel");
            clearTimeout(timer);
            timer = setTimeout(function () {
                tab(_id, tagRel, _this)
            }, def.delay)
        })
    })
};
/*列表倒计时*/
function renderClocks(className){
	className.each(function(){
		var reg = "yyyy-MM-dd HH:mm:ss";
		var sdate = formatDate(new Date(), reg);
		var edate = formatDate(parseInt($(this).attr("downTime")), reg);
		$(this).clock({
			Sdate:sdate,
			Edate:edate,
			china:true,
			callback:function(){
			}
		});
	})
}
(function($){
	$.fn.clock=function(options){
		$.fn.clock.def={
			Sdate:null,
			Edate:"2012-12-21 15:14:23",
			china:false,
			callback:function(){}
		}
		var opts = $.extend($.fn.clock.def, options);
		var timer = null;
		var _iT = null;
		var _this = $(this);
		var _st = opts.Sdate;
		var _et = opts.Edate;
		var cfn = opts.callback;
		if(!strDateTime(_et)){
			alert("日期格式不正确,请重新输入");
			return false;
		}
		if(_st==null){
			var _stime = new Date();
		}
		else{
			_st=_st.toString().replace(/-/g,"/");
			var _stime = new Date(_st);
		}
		_et=_et.toString().replace(/-/g,"/");
		var _etime = new Date(_et);
		var _edT = _etime - _stime;
		var str = "距离结束 ";
		function action() {
			if (_edT < 0){
				opts.china?_this.html(str+"<i>0</i>天<i>00</i>时<i>00</i>分<i>00</i>秒"):_this.html(str+"<i>0</i>天<i>00</i>:<i>00</i>:<i>00</i>");
			}

			if (_iT == null)_iT = _edT / 1000;
			if (_iT >= 0) {
				var _D = Math.floor(_iT / 86400)
				var _H = Math.floor((_iT - 86400 * _D) / 3600);
				var _M = Math.floor((_iT - _D * 86400 - _H * 3600) / 60);
				var _S = Math.floor(_iT % 60);
				opts.china?_this.html(str+"<i>" + _D + "</i>天<i>" + formatNum(_H) + "</i>时<i>" + formatNum(_M) + "</i>分<i>" + formatNum(_S) + "</i>秒"):_this.html(str+"<i>" + _D + "</i>天<i>" + formatNum(_H) + "</i>:<i>" + formatNum(_M) + "</i>:<i>" + formatNum(_S) + "</i>")
				_iT--;
			}
			else {
				clearInterval(timer);
				opts.china?_this.html(str+"<i>0</i>天<i>00</i>时<i>00</i>分<i>00</i>秒"):_this.html(str+"<i>0</i>天<i>00</i>:<i>00</i>:<i>00</i>");
				if (cfn) {
					cfn();
				}
			}
		}
		timer=setInterval(action,1000);
		function formatNum(num){
			return num.toString().replace(/^(\d)$/, "0$1");
		}
		function strDateTime(str){
			var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
			var r = str.match(reg);
			if(r==null)return false;
			var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
			return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
		}
	}
})(jQuery);
//首页顶部和购买页面倒计时,距离开始时间的毫秒数，距离结束时间的毫秒数,startTime>当前时间，为距离开始时间,否则为距离结束时间
function spiketTimeH(id,startTime, endTime,tag) {
	if (endTime <=0 || $('#'+id).length ==0) 
		return;
	var base = $('#'+id).find(tag);
	/*var s1 = base.eq(0);
	var s2 = base.eq(1);
	var s3 = base.eq(2);
	var s4 = base.eq(3);
	var s5 = base.eq(4);
	var s6 = base.eq(5);
	var s7 = base.eq(6);
	var s8 = base.eq(7);*/
	var type = 1;		
	function formatTime(t) {
		if (t > 0) {
			var totalSecond = t / 1000;
			var minute = Math.floor(totalSecond / 60);
			var hour = Math.floor(minute / 60);
			minute = minute % 60;
			var second = Math.floor(totalSecond % 60);
			var mm = Math.floor( t % 10 );
			hour = hour>9?hour:"0"+hour;
			minute = minute>9?minute:"0"+minute;
			second = second>9?second:"0"+second;
			mm = mm>9?mm:"0"+mm;
			return [hour, minute, second, mm];
		} else {
			return ["00", "00", "00", "00"];
		}
	}	
	var timerLeft = function(t, e) {
		var start = (new Date()).getTime();
		return {
			getLeft: function() {
				var now = (new Date()).getTime();
				var s = t - (now - start);
				if (s <=0 && type == 1) {
					this.getLeft = function() {
						var now = (new Date()).getTime();
						var s = e - (now-start);
						return s;
					}
					return this.getLeft();
				}
				
				return s;
			},
			render: function() {
				var arr = formatTime(this.getLeft());
				if(base.length == 6){
					base.eq(0).html(Math.floor(arr[0]/10));
					base.eq(1).html(Math.floor(arr[0]%10));
					base.eq(2).html(Math.floor(arr[1]/10));
					base.eq(3).html(Math.floor(arr[1]%10));
					base.eq(4).html(Math.floor(arr[2]/10));
					base.eq(5).html(Math.floor(arr[2]%10));
					base.eq(6).html(Math.floor(arr[3]/10));
					base.eq(7).html(Math.floor(arr[3]%10));
				}else if(base.length == 3){
					base.eq(0).html(arr[0]);
					base.eq(1).html(arr[1]);
					base.eq(2).html(arr[2]);
					base.eq(3).html(arr[3]);
				}
			}
		}
	};	
	var tl = timerLeft(startTime, endTime);
	tl.render();
	setInterval(function() {
		tl.render();
	},100);
}
function formatDate(time, format){
	var t = new Date(time);
	var tf = function(i){return (i < 10 ? '0' : '') + i;};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
		switch(a){
			case 'yyyy': return tf(t.getFullYear());  break;
			case 'MM': return tf(t.getMonth() + 1); break;
			case 'mm': return tf(t.getMinutes()); break;
			case 'dd': return tf(t.getDate()); break;
			case 'HH': return tf(t.getHours()); break;
			case 'ss': return tf(t.getSeconds()); break;
		};
	})
}
//时间档倒计时timeDown('#leftTime1','10:00:00','20:01:00');
function timeDown(id,startTime,endTime){
	var box = $(id);
	var base = box.find('i');
	var time;
	var shower = function(arr){
		base.eq(0).html(Math.floor(arr[0]/10));
		base.eq(1).html(Math.floor(arr[0]%10));
		base.eq(2).html(Math.floor(arr[1]/10));
		base.eq(3).html(Math.floor(arr[1]%10));
		base.eq(4).html(Math.floor(arr[2]/10));
		base.eq(5).html(Math.floor(arr[2]%10));
		base.eq(6).html(Math.floor(arr[3]/10));
		base.eq(7).html(Math.floor(arr[3]%10));
	}
	var fDate = function(str){
		var new_str = str.replace(/:/g,'-');
		new_str = new_str.replace(/ /g,'-');
		var arr = new_str.split("-");
		var datum = new Date(Date.UTC(arr[0],arr[1],arr[2],arr[3]-8,arr[4],arr[5]));
		return datum.getTime()/1000;
	}
	var getLeftTime = function(allSecond){
		var totalSecond = allSecond ;
		var minute = Math.floor(totalSecond / 60);
		var hour = Math.floor(minute / 60);
		minute = minute % 60;
		var second = Math.floor(totalSecond % 60);
		var mm = Math.floor( allSecond % 10 );
		hour = hour>9?hour:"0"+hour;
		minute = minute>9?minute:"0"+minute;
		second = second>9?second:"0"+second;
		mm = mm>9?mm:"0"+mm;
		return [hour, minute, second, mm];
	}
	var rend = function(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();	
		var strN = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
		var strS = year+'-'+month+'-'+day+' '+startTime;
		var strE = year+'-'+month+'-'+day+' '+endTime;
		var e = fDate(strE) - fDate(strN);
		var s = fDate(strS) - fDate(strN);	
		if(s>0){
			shower(getLeftTime(s));
			box.find('.timeTipMsg').text('距离开始时间');
		}else if(s<=0 && e>0){
			if(s==0){
				$('#onTime10').find('.selling').attr('class','on-sell')
			}
			shower(getLeftTime(e));
			box.find('.timeTipMsg').text('距离结束时间');
		}else if(e<=0){
			shower(getLeftTime(e));
			box.find('.timeTipMsg').text('已结束');
			clearInterval(time);
		}
	}
	rend();
	time = setInterval(function(){
		rend();
	},100); 
}
//首页列表倒计时
function renderDownClock(className){
	className.each(function(){
		var o = $(this);
		var st = $(this).attr('upTime');
		var et = $(this).attr('downTime');
		downClock({
			id:o,
			startDate:st,
			endDate:et,
			callback:changeClass
		});
		var ele;
		if(o.parent().parent().hasClass('brand-box')){
			ele = o.parent().parent().parent().parent();
		}if(o.parent().parent().hasClass('good-info')){
			ele = o.parent().parent().parent().parent().parent();
		}
		var eleP = ele.parent();
		function changeClass(){
			if(eleP.hasClass('banner-info')){
				ele.attr('class','brand-on-sell');
			}
			if(eleP.hasClass('good-list')){
				ele.attr('class','on-sell');
			}
			o.find('.brand-notice').hide();
		}
	})
}
function downClock(opt){
	var def = {
		id:'',
		startDate:null,
		endDate:null,
		callback:function(){}
	}
	$.extend(def,opt);
	var box = def.id;
	var sDate = def.startDate;
	var eDate = def.endDate;
	var nDate = (new Date()).getTime();
	var fun = def.callback;
	var time;	
	var getLeftTime = function(allSecond){
		var totalSecond = allSecond/1000 ;
		var day = Math.floor(totalSecond/(24*60*60));
		var l = totalSecond%(24*60*60);
		var hour = Math.floor(l/(60*60));
		l = l%(60*60);
		var minute = Math.floor(l/60);
		var second = Math.floor(l%60);		
		return [day,hour,minute,second];
	}
	var ds = sDate - nDate;
	var de = eDate - nDate;
	var m  = 0;
	var str = ''
	var rend = function(){
		nDate = (new Date()).getTime();
		ds = sDate - nDate;
		de = eDate - nDate;
		m = ds>0?ds:(de>0?de:0);
		if(ds>=0){
			str = '距离开始时间';	
			if(Math.floor(ds/1000)==0 && fun){
				fun();
			}
		}else if(ds<0 && de>=0){
			str = '距离结束时间';	
		}else if(de<0){
			str = '已结束';
			clearInterval(time);			
		}
		box.html(str+'<i>'+getLeftTime(m)[0]+"</i>天<i>"+getLeftTime(m)[1]+'</i>时<i>'+getLeftTime(m)[2]+'</i>分<i>'+getLeftTime(m)[3]+'</i>秒<i>');
	}
	rend();
	time = setInterval(function(){
		rend();
	},100)
}
$(function(){	
	renderDownClock($('.time-span111'));
})
//时间档tab去掉，回调方法抽离
function test(){
    var box = $('.banner-list>ul');
    var index = box.index();
    var len = box.children().length;
    box.attr('max',Math.ceil(len/4));
    if(!(!!box.attr('added')) && len>4){
        //复制节点，无缝滚动        
        var lastNode = [],fNode=[];
        for(var i = len-1;i>len - 5;i--){
            var temp = box.children().eq(i).clone().removeClass('on');
            lastNode.push(temp);
        }
        for(var i=0;i<4;i++){
            var temp = box.children().eq(i).clone().removeClass('on');
            fNode.push(temp);
        }
        for(var i=0;i<4;i++){
            lastNode[i].insertBefore(box.children().eq(0));
            box.append(fNode[i]);
        }
        box.css({'left':-1*parseFloat(box.parent().width()+10)});
        box.attr('added',true);
        len = box.children().length;
    }
    box.css('width',len*250);
    snTemai.slideAct({
        id:$('.banner-list>ul'),
        lbtn:$('.banner-main').find('.prev'),
        rbtn:$('.banner-main').find('.next')
    });    
}
