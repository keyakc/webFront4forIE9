
//注册事件
$("#clo_yellow").click(function(){$(this).parent().parent().hide();});
var login_back=$("#login_back");
$("#login_close").click(function(){login_back.hide();});
var foc=$("#foc");foc.click(follow);
var unfoc=$("#unfoc");unfoc.click(unfollow);

var banner_control=$("#banner_control");
var control_items=$(".control_item");control_items.click(banner_click);


function banner_click(event) {
	var page=$(this).index();
	banner_change(page);
	banner_contorl_change(page);
}
function follow() {	
	showLogin();
}
function unfollow() {
	unfoc.hide();
	foc.show();
}
function showLogin() {
	//判断LocalStorage是否已登录
	//若未登录
	login_back.show();
}
function login_submit() {
	var inputs=document.getElementById("login_form").getElementsByTagName("input");

	var userName=inputs[0].value,
		password=inputs[1].value;
		userName=md5(userName);
		password=md5(password);

	var xhr=new XMLHttpRequest();
				//get请求
				var url="http://study.163.com/webDev/login.htm";//相对当前文档路径
				xhr.open('get',url+'?'+'userName='+userName+'&password='+password,true);	
				xhr.send(null);		
				xhr.onreadystatechange=function(){			
					if (xhr.readyState==4&&xhr.status==200){
						var resp=xhr.responseText;
						if(resp==1) {						
							foc.hide();
							unfoc.show();
							login_close.click();
						}
						if(resp==0) {
						console.log("login failed");
						}
					}
				}
}
//banner以及初始化
var banner=$("#banner");
var banner_inner=$("#banner_inner");
var items=$(".item");
var control_items=$(".control_item");
// 计时
var setInt=setInterval(banner_slide,5000);
banner.mouseover(function () {clearInterval(setInt);});
banner.mouseout(function () {setInt=setInterval(banner_slide,5000);});
//幻灯片样式切换
function banner_slide() {
	var n=items.filter(".banner_active").index();
	n=(n+1)%3;
	banner_change(n);
	banner_contorl_change(n);
}
function banner_change(m) {	
	items.removeClass("banner_active");
	items.eq(m).addClass("banner_active");
	items.css("opacity",0);	
	setInterval(function(){items.eq(m).css('opacity',1)},5);	
}

//用于重构
var table=course.getElementsByTagName("table")[0];
var tbody=table.getElementsByTagName("tbody")[0];
var course_nav=document.getElementById("course_nav");
var course_class=course_nav.getElementsByTagName("a");
var course_nav_a=$("#course_nav a");
course_nav_a.click(course_change);

function course_change(event) {
	var m=$(this).index();
	//清除指定样式
	//根据序号赋active
	course_nav_a.removeClass("nav_active");	
	course_nav_a.eq(m).addClass("nav_active");
	//构造type
	m=(m+1)*10;
	//Ajax重构
	ajaxReconstruct(1,m);	
}

function banner_contorl_change(m) {
	control_items.removeClass("control_active");
	control_items.eq(m).addClass("control_active");
}
function ajaxReconstruct(pageNo,type) {
	//根据序号m发送Ajax请求重构页面
	var psize=20;
	var listJs;	
	var xhr=new XMLHttpRequest();
	//get请求
	var url="http://study.163.com/webDev/couresByCategory.htm";//相对当前文档路径
	xhr.open('get',url+"?pageNo="+pageNo+"&psize="+psize+"&type="+type+"",true);	
	xhr.send(null);
	xhr.onreadystatechange=function(){			
		if (xhr.readyState==4&&xhr.status==200){
			console.log("have sent");
			listJs=JSON.parse(xhr.responseText);
			//重构列表				
			var tbody=$("#course").find("tbody");
			tbody.empty();
			var nowJsObj=[],str;
			for(a=0,b=listJs.list.length;a<b;a++){
				if(a%4==0) str += "<tr></tr>";
					nowJsObj=listJs.list[a];
					var priceJudge=(nowJsObj.price==0)?'免费':'￥'+nowJsObj.price;
					str +='\
					<td>\
						<div class="course_unit" data-seq="'+a+'">\
							<img src="'+nowJsObj.middlePhotoUrl+'">\
							<p>'+nowJsObj.name+'</p>\
							<p>'+nowJsObj.provider+'</p>\
							<p><label>&nbsp&nbsp&nbsp&nbsp'+nowJsObj.learnerCount+'</label></p>\
							<p>'+priceJudge+'</p>\
							<div class="course_hover">\
								<div>\
									<img src="'+nowJsObj.middlePhotoUrl+'">\
									<div class="right_inner">\
										<p>'+nowJsObj.name+'</p>\
										<p><label></label>&nbsp&nbsp&nbsp&nbsp&nbsp'+nowJsObj.learnerCount+'人在学</p>\
										<div>发布者：'+nowJsObj.provider+'</div>\
										<div>适用：'+nowJsObj.targetUser+'</div>\
									</div>\
								</div>\
								<div>\
									<p>'+nowJsObj.description+'</p>\
								</div>\
							</div>\
						</div>\
					</td>\
					';				
			}
			console.log(listJs.list[0]);
			tbody.html(str);
			//单元注册
			var course_hovers=$(".course_hover");
			function show_hover(m) {
				return function() {
					if(document.all){ //判断IE浏览器
					  window.event.returnValue = false;
					}
					else{
					  event.preventDefault();
					};
					course_hovers.eq(m).show();
				}
			}
				
				var course_units=$(".course_unit");
				course_units.mouseenter(function(){$(this).find(".course_hover").show();});
				var course_hover=$(".course_hover");
				course_hover.mouseleave(function(){$(this).hide();})
			//排序
			var sortList=listJs.list.sort(byLearner);
			function byLearner(a,b) {
				return b.learnerCount-a.learnerCount;
			}
			//构建rank
			var rank_inner=$("#rank_inner");
			rank_inner.empty();
			var str='';
			for(i=0;i<9;i++) {
				 str+='\
				<div>\
					<div>\
					<img src="'+sortList[i].smallPhotoUrl+'">\
					</div>\
					<div>\
						<p>'+sortList[i].name+'</p>\
						<p>&nbsp&nbsp<label></label>'+sortList[i].learnerCount+'人</p>\
					</div>\
				</div>\
				';
			}
			rank_inner.html(str);
		};
	};
}
var page=document.getElementById("page");
var page_items=page.getElementsByTagName("a");
page.onclick=function(event) {
	var type;
	var page;
	//get type
	for(i=0;i<course_class.length;i++){		
		if(course_class[i].className.indexOf("nav_active")!=-1){
			type=[i+1]*10;
		}
	}
	page=event.target.innerText;
	if(page!='>'&&page!='<') {
		var pages=event.target.parentNode.childNodes;
		for(i=0;i<pages.length;i++) {
			pages[i].className='';
		}
		event.target.className+="active";
		ajaxReconstruct(page,type);
	}

}
page_items[0].onclick=pre_page;
function pre_page(event){
	var active=event.target.parentNode.getElementsByClassName("active")[0];
	var newPage=Number(active.innerText)-1;
	var type,flag;
	//get type
	for(i=0;i<course_class.length;i++){		
		if(course_class[i].className.indexOf("nav_active")!=-1){
			type=[i+1]*10;
		}
	}
	if(newPage!=0){
		ajaxReconstruct(newPage,type);
		active.className='';
		page_items[newPage].className+="active";
	}
}
page_items[9].onclick=next_page;
function next_page(event){
	var active=event.target.parentNode.getElementsByClassName("active")[0];
	var newPage=Number(active.innerText)+1;
	var type,flag;
	//get type
	for(i=0;i<course_class.length;i++){		
		if(course_class[i].className.indexOf("nav_active")!=-1){
			type=[i+1]*10;
		}
	}
	if(newPage<page_items.length-1){
		console.log('newPage='+newPage+' page_items.length='+page_items.length);
		ajaxReconstruct(newPage,type);
		active.className='';
		page_items[newPage].className+="active";
	}
}
window.onload=function() {
		unfoc.hide();
	ajaxReconstruct(1,10);
}
