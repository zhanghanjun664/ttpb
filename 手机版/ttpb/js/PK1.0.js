var canvas=document.getElementById("canvas");
var score=document.getElementsByClassName("bx_num")[0];
var dis=document.getElementsByClassName("jl_num")[0];
var stop=document.getElementsByClassName("stop")[0];
var stop_cont=document.getElementsByClassName("stop_cont")[0];
var btn_jixu=document.getElementsByClassName("jixu")[0];//继续游戏
var restart=document.querySelector(".chongxin");//重新开始
var paiming=document.querySelector(".paiheng");//排行榜(按钮)
var daojishi=document.getElementsByClassName("daojishi")[0];
var stop_box=document.getElementsByClassName("stop_box")[0];
var power_num=document.getElementsByClassName("power_num")[0];
var power_box=document.getElementsByClassName("power_box")[0];
var click=document.getElementsByClassName("click")[0];//点击手指
var chong=document.getElementsByClassName("chong")[0];//冲刺提示
var zuigaofen=document.getElementsByClassName("zuigaofen")[0];//最高分
var zongfen=document.getElementsByClassName("total_all")[0];//总分
var game=document.getElementById("game");//游戏页
var ready=document.getElementById("ready");//首页
var go=document.getElementsByClassName("go")[0];//开始游戏按钮
var pm_box=document.querySelector(".paiming");//排行榜面板
var pm_li=pm_box.getElementsByTagName("li")[0];//单个用户
var mark=document.getElementsByClassName("mark")[0];//成绩
var again=document.getElementsByClassName("again")[0];//再来一局
var die=document.querySelector(".die");//死亡面板
var ending=document.querySelector("#ending");//计分页
var total_juli=document.querySelector(".total_juli");//计分--距离
var total_fenshu=document.querySelector(".total_fenshu");//计分--分数
var total_all_box=document.querySelector(".total_all_box");//总分盒子
var best=document.querySelector(".best");//最高分的特效
var back=document.querySelector(".ending_b_back");
var ctx=canvas.getContext("2d");
var dW=document.documentElement.clientWidth;
var dH=document.documentElement.clientHeight;
var bg_index=0;
var num=0,num2=0;//帧动画
var cha=0;
canvas.width=dW;
canvas.height=dH;
var bg=new Image();
var btn1=new Image();
var btn2=new Image();
var star=new Image();
var goldArr=[];//装金币的数组
var obs1=[],obs2=[];//装障碍物的数组
var gold_bol=true;//gold_bol为true才出金币
var zt_bol=true;//点击暂停的bol
var kobe=0;//游戏页面
var ballarr = [];//装星星的数组
var move_bol=true;//排行榜面板能滚动
var ebol=false;//ebol为true才能冲刺

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext('2d');
canvas2.width=dW;
canvas2.height=dH;

bg.src="img/pk_bg.png";
btn1.src="img/pk_icon.png";
star.src="img/pk_start.png";

//蓝色字体的位置30 36 
var bfont=[0,-39,-77,-117,-158,-200,-241,-283,-320,-361];
//黄色字体的位置24 36
var yfont=[0,-36,-70,-105,-137,-175,-209,-242,-277,-311];
//大号字体48 56   y：72
var bigfont=[0,-46,-94,-140,-188,-235,-282,-331,-378,-425];
score.value=0;
dis.value=0;

//点击开始游戏
go.addEventListener("touchstart",function(e){
	ready.style.display="none";
	game.style.display="block";
	kobe=1;
	hero.type=1;
	hero.y=dH*0.55;
	newGame();
	e.stopPropagation();
})

var ajax=null;
if(window.ActiveXObject){
    ajax=window.ActiveXObject("Microsoft.XMLHTTP");
}else{
    ajax=new XMLHttpRequest();
}
ajax.open("GET","paihengbang.php",false);
ajax.send();
//ajax.onreadystatechange=function(){
    if(ajax.readyState==4){
        var json=JSON.parse(ajax.responseText);
        for (var p=0;p<json.length-1;p++) {
            pm_box.appendChild(pm_li.cloneNode(true));
        }
        var pm_bcont=pm_box.getElementsByTagName("li");
        for (var m=0;m<pm_bcont.length;m++) {
            pm_bcont[m].getElementsByTagName("img")[0].src=json[m]["img"];
            pm_bcont[m].getElementsByTagName("span")[0].innerHTML=json[m]["name"];
            pm_bcont[m].getElementsByTagName("span")[1].innerHTML=json[m]["score"];
        }
    }
//}

//点击查看成绩
mark.addEventListener("touchstart",function(){
	die.style.display="none";
	game.style.display="none";
	ending.style.display="block";
	kobe=2;
	
   // console.log(ajax_name,ajax_img,ajax_openid)
   // alert(ajax_name,ajax_img,ajax_openid);
	//分数
	total_juli.innerHTML=dis.value;
	total_fenshu.innerHTML=score.value;
	zongfen.value=parseInt(dis.value*2.1314)+score.value;
	zongImg(zongfen.value);
	
	var ajax=new XMLHttpRequest();
	ajax.open("GET","pk1.0.php?name="+ajax_name+"&score="+zongfen.value+"&img="+ajax_img+"&openid="+ajax_openid,true);
	ajax.send(null);
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4){
			//console.log(ajax.responseText);
			zuigaofen.innerHTML=ajax.responseText;
			if(zongfen.value>=ajax.responseText){
				best.style.display="block";
			}
		}
	}
})

//点击返回
back.addEventListener("touchstart",function(){
	ending.style.display="none";
	ready.style.display="block";
	best.style.display="none";//最高分的图片消失
    
    var ajax=null;
if(window.ActiveXObject){
    ajax=window.ActiveXObject("Microsoft.XMLHTTP");
}else{
    ajax=new XMLHttpRequest();
}
ajax.open("GET","paihengbang.php",false);
ajax.send();
//ajax.onreadystatechange=function(){
    if(ajax.readyState==4){
        pm_box.innerHTML="";
        var json=JSON.parse(ajax.responseText);
        for (var p=0;p<json.length;p++) {
            pm_box.appendChild(pm_li.cloneNode(true));
        }
        var pm_bcont=pm_box.getElementsByTagName("li");
        for (var m=0;m<pm_bcont.length;m++) {
            pm_bcont[m].getElementsByTagName("img")[0].src=json[m]["img"];
            pm_bcont[m].getElementsByTagName("span")[0].innerHTML=json[m]["name"];
            pm_bcont[m].getElementsByTagName("span")[1].innerHTML=json[m]["score"];
        }
    }
//}
    
})

//点击重新开始游戏
restart.addEventListener("touchstart",function(){
	stop_cont.style.display="none";
	newGame();
})

//点击排行榜
paiming.addEventListener("touchstart",function(){
	stop_cont.style.display="none";
	game.style.display="none";
	ready.style.display="block";
	kobe=0;
})

//点击再来一局
again.addEventListener("touchstart",function(){
	die.style.display="none";
	newGame();
})

zongfen.value=0;
//总分变图片
function zongImg(num){
	var str=String(num).split("");
	total_all_box.innerHTML="";
	total_all_box.style.width=str.length*48+"px";
	for (var i=0;i<str.length;i++) {
		var div=document.createElement("div");
		div.style.backgroundPositionX=bigfont[Number(str[i])]+"px";
		total_all_box.appendChild(div);
	}
}




//			console.log(score.children);
//点中暂停按钮
stop.addEventListener("touchstart",function(){
	stop_cont.style.display="block";
	zt_bol=false;
	
})
//点中 继续游戏
btn_jixu.addEventListener("touchstart",function(){
	stop_box.style.display="none";
	daojishi.style.display="block";
	daojishi.style.animation="bian 3s alternate";
	setTimeout(function(){
		zt_bol=true;
		daojishi.style.display="none";
		stop_cont.style.display="none";
		stop_box.style.display="block";
	},3000)
})

//点击冲刺
power_num.addEventListener("touchstart",function(){
	if(chongci_bol1){
		chong_num++;
		chongci_bol1=false;
		chongci_bol=false;
	}
})

var chong_num=0;//冲刺的次数
//chongci_bol力量没满的时候，不断增加。chongci_bol1力量满了就可以点击冲刺
var chongci_bol=true,chongci_bol1=false;
function changeImg(num1,num2){
	var scoreArr=String(num1).split("");
	var disArr=String(num2).split("");
	score.innerHTML="";
	dis.innerHTML="";
	//把分数转化成图片
	for (var z=0;z<scoreArr.length;z++) {
		var num=document.createElement("div");
		var j_num=document.createElement("div");
		num.style.backgroundPositionX=bfont[Number(scoreArr[z])]+"px";
		score.appendChild(num);
		j_num.style.backgroundPosition=yfont[Number(disArr[z])]
	}
	//把距离转化成图片
	for (var r=0;r<disArr.length;r++) {
		var num=document.createElement("div");
		num.style.backgroundPosition=yfont[Number(disArr[r])]+"px -36px";
		dis.appendChild(num);
	}
	if(chongci_bol){
		var power=num1*0.1-100*chong_num;
		//能量转化为百分比
		if(power>=100){
			power=100;
			chongci_bol1=true;
			click.style.display="block";
			chong.style.display="block";
		}
		power_num.innerHTML=power+"%";
		power_box.style.width=215/100*power+"px";
	}else{
		chongci_bol=true;
		click.style.display="none";
		chong.style.display="none";
		power_num.innerHTML=0+"%";
		power_box.style.width=0+"px";
		//冲刺模式
		ebol=true;
		hero.type=5;
		hero.y= dH*0.3;
		daoju=new prop();
	}
}


function allBg(){
	//背景
	if(bg_index>=dW){
		bg_index=0;
	}
	ctx.drawImage(bg,-bg_index,0,dW,dH*1.2);
	ctx.drawImage(bg,dW-bg_index,0,dW,dH*1.2);
    //右按钮
   // ctx.drawImage(btn1,0,141,67,67,dW-67-5,(dH-67-5),67,67);
    //左按钮
    //ctx.drawImage(btn1,76,141,67,67,5,(dH-67-5),67,67);	
   
}
allBg()


var hero=new role("img/role1.png");
//创建角色
function role(src){
	var img=new Image();
	var _this=this;
	img.src=src;
	this.obj=img;
	this.rindex=0;
	this.rindex2=0;
	//起跳
	this.jindex=0;
	this.jindex2=0;
	this.jindex3=0;
	this.jindex4=0;
	//趴下
	this.tindex=0;
	this.width=115;
	this.height=112;
	this.jbol1=true;
	this.jbol2=true;
	this.type=1;
	this.x=170;
	this.y=dH*0.55;
	ctx.drawImage(img,_this.rindex*_this.width,0,_this.width,_this.height,this.x,this.y,_this.width*0.7,_this.height*0.7)
}
//角色跑步
role.prototype.run=function(){
	if(bg_v<=6){
		this.rspeed=4
	}
	if(bg_v>6&&bg_v<10){
		this.rspeed=3;
	}
	if(bg_v>=10){
		this.rspeed=2;
	}
	//跑步
	if(this.type==1){
		//回到地上又可以跳了
		this.jbol1=true;
		this.jbol2=true;
		//记录次数
		this.rindex2++;
		if(this.rindex2%this.rspeed==0){
			//改变位置
			this.rindex++;
		}
		if(this.rindex>=10){
			this.rindex=0;
			this.rindex2=0;
		}
		
		ctx.drawImage(this.obj,this.rindex*this.width,0,this.width,this.height,this.x,this.y,this.width*0.7,this.height*0.7)
	}
	//第一跳
	if(this.type==2){
		this.jindex2++;
		if(this.jindex2%4==0){
			this.jindex++;
		}
		//改变this.y,即top值
		if(this.jindex2>=18){
			this.y+=8
		}else{
			this.y-=8
		}
		if(this.jindex>=9){
			this.y=dH*0.55;
			this.type=1;
			this.jindex=0;
			this.jindex2=0;
		}
		cha=this.y;
		ctx.drawImage(this.obj,this.jindex*this.width,this.height,this.width,this.height,this.x,this.y,this.width*0.7,this.height*0.7)
	}
//				第二跳
	if(this.type==3){
		this.jindex3++;
		if(this.jindex3%4==0){
			this.jindex4++;
		}
		if(this.jindex4>=9){
			this.type=1;
			this.jindex=0;
			this.jindex2=0;
			this.jindex3=0;
			this.jindex4=0;
//						this.y=dH*0.55;
		}
		if(this.jindex3>=18){
			//要加上（dH*0.55-cha）才是均匀落地
			this.y+= ((dH*0.55-cha+108)/18);
		}else{
			this.y-=6;
		}
		ctx.drawImage(this.obj,this.jindex4*this.width,this.height,this.width,this.height,this.x,this.y,this.width*0.7,this.height*0.7)
	}
	//下滑
	if(this.type==4){
		this.tindex++;
		if(this.tindex<=40){
			ctx.drawImage(this.obj,9*this.width,this.height,this.width,this.height,this.x,this.y,this.width*0.7,this.height*0.7)
		}else{
			this.type=1;
			this.tindex=0;
		}
	}
	//冲刺
	if(this.type==5){
		
		ctx.drawImage(this.obj,9*this.width,0,this.width,this.height,this.x,this.y,this.width*0.7,this.height*0.7);
	}
//	ctx.beginPath();
//	ctx.rect(this.x,this.y,this.width*0.7,this.height*0.7);
//	ctx.stroke();
}
var daoju;
document.addEventListener("keydown",function(e){
//	console.log(e.keyCode);
	if(e.keyCode==32){
		ebol=true;
		hero.type=5;
		hero.y=dH*0.3;
		daoju=new prop();
	}
	if(e.keyCode==81){
		ebol=false;
		hero.y=dH*0.55;
		hero.type=1;
	}
	if(e.keyCode==87){
		die.style.display="block";
		zt_bol=false;
	}
	if(e.keyCode==82){
		zt_bol=false;
	}
	if(e.keyCode==40){
		zt_bol=true;
	}
})


//点击事件
document.addEventListener("touchstart",function(e){
	var e=e||window.event;
	var x=e.touches[0].clientX,y=e.touches[0].clientY;
	var tx=x-(5+67*0.5);
	var ty=y-(dH-67*0.5-5);
	var jx=x-(dW-67*0.5-5);
	var jy=y-(dH-67*0.5-5);
	var dt=Math.sqrt(tx*tx+ty*ty);
	var dj=Math.sqrt(jx*jx+jy*jy);
	
	if(zt_bol){
		if(hero.type!=5){
			//起跳
			if(dj<=67*0.5){
				if(hero.jbol1||hero.jbol2){
					if(hero.jbol1){
						hero.type=2;
						hero.jbol1=false;
					}else{
						hero.type=3;
						hero.jbol2=false;
					}
				}
			}
			//下滑
			if(dt<=67*0.5){
				if(hero.jbol1&&hero.jbol2){
					hero.type=4;
				}
			}
		}
	}
})

var fireH=dH*0.55+112*0.7-50;
//上方障碍物
function obstr1(){
	var obs=new Image();
	obs.src="img/obs2.png";
	this.width=115;
	this.height=398;
	this.nheight=dH*0.55+20;
	this.x=dW;
	this.y=0;
	this.obj=obs;
	this.type=rnd(0,3);
}
obstr1.prototype.draw=function(){
	ctx.drawImage(this.obj,this.type*this.width,147,this.width,this.height,this.x,this.y,this.width,this.nheight);
//	ctx.beginPath();
//	ctx.rect(this.x,this.y,this.width,this.nheight);
//	ctx.stroke();
}
obstr1.prototype.hitTestObject = function(sprite) {
	var minx = this.x > sprite.x ? this.x : sprite.x;
	var maxx = this.x + this.width < sprite.x + sprite.width*0.7 ? this.x + this.width : sprite.x + sprite.width*0.7;
	var miny = this.y > sprite.y ? this.y : sprite.y;
	var maxy = this.y + this.nheight < sprite.y + sprite.height*0.7 ? this.y + this.nheight : sprite.y + sprite.height*0.7;

	if(minx >= maxx || miny >= maxy) {
		return false;
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', dW);
	canvas.setAttribute('height', dH);
	var context = canvas.getContext('2d');
	
	var canvas2 = document.createElement('canvas');
	canvas2.setAttribute('width', dW);
	canvas2.setAttribute('height', dH);
	var context2 = canvas2.getContext('2d');
	var index=0,cutY=0;
	/*第一种方法*/
	context.drawImage(this.obj,this.type*this.width,147,this.width,this.height,this.x, this.y, this.width, this.nheight)
	var data1 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
	switch (sprite.type){
		case 1:
			index=sprite.rindex;
			cutY=0;
			break;
		case 2:
			index=sprite.jindex;
			cutY=1;
			break;
		case 3:
			index=sprite.jindex4;
			cutY=1;
			break;
		case 4:
			index=9;
			cutY=1;
			break;
		default:
			break;
	}
	context2.drawImage(sprite.obj,index*sprite.width,cutY*sprite.height,sprite.width,sprite.height,sprite.x, sprite.y, sprite.width*0.7, sprite.height*0.7);
	var data2 = context2.getImageData(minx, miny, maxx - minx, maxy - miny).data;
	for(var i = 3; i < data1.length; i += 4) {
		if(data1[i] > 0 && data2[i] > 0){
			return true;
		} 
	}
	return false;
}

//下方障碍物
function obstr2(index){
	var fire=new Image();
	fire.src="img/obs2.png";
	switch (index){
		//火
		case 1:
			this.width=45;
			this.height=127;
			this.nwidth=30;
			this.nheight=40;
			this.cut=0;
			break;
		//刺
		case 2:
			this.width=48;
			this.height=127;
			this.nwidth=30;
			this.nheight=40;
			this.cut=45;
			break;
		//机器人
		case 3:
			this.width=81;
			this.height=140;
			this.nwidth=40;
			this.nheight=70;
			this.cut=96;
			break;
		//蟹
		case 4:
			this.width=100;
			this.height=137;
			this.nwidth=50;
			this.nheight=68;
			this.cut=180;
			break;
		//鬼
		case 5:
			this.width=107;
			this.height=136;
			this.nwidth=55;
			this.nheight=70;
			this.cut=281;
			break;
		//高导弹
		case 6:
			this.width=108;
			this.height=140;
			this.nwidth=60;
			this.nheight=110;
			this.cut=391;
			break;
		default:
			break;
	}
//				this.nheight=this.height*0.5;
	this.x=dW;
	this.y=dH*0.55+112*0.7-this.nheight;
	this.obj=fire;
//				this.type=rnd(0,1);
	
	
}
obstr2.prototype.draw=function(){
	ctx.drawImage(this.obj,this.cut,0,this.width,this.height,this.x,this.y,this.nwidth,this.nheight);
//	ctx.beginPath();
//	ctx.rect(this.x,this.y,this.nwidth,this.nheight);
//	ctx.stroke();
}
obstr2.prototype.hitTestObject = function(sprite) {
	var minx = this.x > sprite.x ? this.x : sprite.x;
	var maxx = this.x + this.nwidth < sprite.x + sprite.width*0.7 ? this.x + this.nwidth : sprite.x + sprite.width*0.7;
	var miny = this.y > sprite.y ? this.y : sprite.y;
	var maxy = this.y + this.nheight < sprite.y + sprite.height*0.7 ? this.y + this.nheight : sprite.y + sprite.height*0.7;

	if(minx >= maxx || miny >= maxy) {
		return false;
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', dW);
	canvas.setAttribute('height', dH);
	var context = canvas.getContext('2d');
	/*第一种方法*/
	context.drawImage(this.obj,this.cut,0,this.width,this.height,this.x, this.y, this.nwidth, this.nheight)
	var data1 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
	context.clearRect(0,0,dW,dH);
	var index=0,cutY=0;
	switch (sprite.type){
		case 1:
			index=sprite.rindex;
			cutY=0;
			break;
		case 2:
			index=sprite.jindex;
			cutY=1;
			break;
		case 3:
			index=sprite.jindex4;
			cutY=1;
			break;
		case 4:
			index=9;
			cutY=1;
			break;
		default:
			break;
	}
	context.drawImage(sprite.obj,index*sprite.width,cutY*sprite.height,sprite.width,sprite.height,sprite.x, sprite.y, sprite.width*0.7, sprite.height*0.7);
	
	var data2 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;

	for(var i = 3; i < data1.length; i += 4) {
		if(data1[i] > 0 && data2[i] > 0){
			return true;
		} 
	}
	return false;
}




//道具
function prop(){
	var pro=new Image();
	pro.src="img/effect.png";
	this.index=0;
	this.index2=0;
	this.obj=pro;
	this.headW=60;
	this.headH=125;
	this.headNW=50;
	this.headNH=hero.height;
	this.headX=hero.x+hero.width*0.7-this.headNW*0.8;
	this.headY=hero.y+hero.height*0.35-this.headNH*0.5;
	
	this.bodyW=100;
	this.bodyH=100;
	this.bodyX=hero.x;
	this.bodyY=hero.y;
	this.bodyNW=hero.width*0.7;
	this.bodyNH=hero.height*0.7;
	
	this.tailW=229;
	this.tailH=118;
	this.tailNW=150;
	this.tailNH=hero.height*0.6;
	this.tailX=hero.x-this.tailNW;
	this.tailY=hero.y+hero.height*0.35-this.tailNH*0.5;
	
}
prop.prototype.draw=function(){
	this.index2++;
	if(this.index2>=180){
		ebol=false;
		hero.y=dH*0.55;
		hero.type=1;
		chongci_bol1=false;
		return
	}
	if(this.index2%5==0){
		this.index++;
	}
	if(this.index>=3){
		this.index=0
	}
	//头
	ctx.drawImage(this.obj,this.headW*this.index,118,this.headW,this.headH,this.headX,this.headY,this.headNW,this.headNH)
	//身
	ctx.drawImage(this.obj,this.bodyW*this.index,250,this.bodyW,this.bodyH,this.bodyX,this.bodyY,this.bodyNW,this.bodyNH)
	//尾
	ctx.drawImage(this.obj,this.tailW*this.index,0,this.tailW,this.tailH,this.tailX,this.tailY,this.tailNW,this.tailNH)
}


//创建金币
function gold(){
	var money=new Image();
	money.src="img/pk_icon.png";
	this.width=30;
	this.height=30;
	this.x=dW;
	this.y=dH*0.55-rnd(45,45+hero.height*0.4);
	this.obj=money;
	this.property="money";
}
gold.prototype.draw=function(){
	ctx.drawImage(this.obj,191,60,48,44,this.x,this.y,this.width,this.height);
//	ctx.beginPath();
//	ctx.rect(this.x,this.y,this.width,this.height);
//	ctx.stroke();
}
//			gold.prototype.hitTestObject = function(sprite) {
//				var minx = this.x > sprite.x ? this.x : sprite.x;
//				var maxx = this.x + this.width < sprite.x + sprite.width*0.7 ? this.x + this.width : sprite.x + sprite.width*0.7;
//				var miny = this.y > sprite.y ? this.y : sprite.y;
//				var maxy = this.y + this.height < sprite.y + sprite.height*0.7 ? this.y + this.height : sprite.y + sprite.height*0.7;
//		
//				if(minx >= maxx || miny >= maxy) {
//					return false;
//				}
//		
//				var canvas = document.createElement('canvas');
//				canvas.setAttribute('width', dW);
//				canvas.setAttribute('height', dH);
//				var context = canvas.getContext('2d');
//				/*第一种方法*/
//				context.drawImage(this.obj, this.x, this.y, this.width, this.height)
//				var data1 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
//				context.clearRect(0,0,dW,dH);
//				context.drawImage(sprite.obj, sprite.x, sprite.y, sprite.width*0.7, sprite.height*0.7);
//				var data2 = context.getImageData(minx, miny, maxx - minx, maxy - miny).data;
//		
//				for(var i = 3; i < data1.length; i += 4) {
//					if(data1[i] > 0 && data2[i] > 0){
//						return true;
//					} 
//				}
//				return false;
//			}
gold.prototype.hitTestObject = function(sprite) {
	var minx = this.x > sprite.x ? this.x : sprite.x;
	var maxx = this.x + this.width < sprite.x + sprite.width*0.7 ? this.x + this.width : sprite.x + sprite.width*0.7;
	var miny = this.y > sprite.y ? this.y : sprite.y;
	var maxy = this.y + this.height < sprite.y + sprite.height*0.7 ? this.y + this.height : sprite.y + sprite.height*0.7;

	if(minx >= maxx || miny >= maxy) {
		return false;
	}

	var canvas = document.createElement('canvas');
	canvas.setAttribute('width', dW);
	canvas.setAttribute('height', dH);
	var ctx2 = canvas.getContext('2d');
	ctx2.clearRect(0,0,canvas.width,canvas.height);
	ctx2.globalCompositeOperation = "source-over";
	ctx2.drawImage(this.obj,191,60,48,44,this.x,this.y,this.width,this.height);
	
	ctx2.globalCompositeOperation = "source-in";
	ctx2.drawImage(sprite.obj,sprite.rindex*sprite.width,0,sprite.width,sprite.height,sprite.x,sprite.y,sprite.width,sprite.height)
	
	var imagedate = ctx2.getImageData(minx, miny, maxx - minx, maxy - miny)
//				var imagedate = ctx2.getImageData(sprite.x, sprite.y, sprite.width,sprite.height)
	
	for (var j=3;j<imagedate.data.length;j+=4) {
		if (imagedate.data[j]>0) {
			return true
		}
	}
}

//新的游戏
function newGame(){
	num=0;
	//速度恢复
	bg_v=4;
	dis_v=0;
	gold_v=5;
	dis.value=0;//距离清零
	score.value=0;//得分清零
	goldArr=[];//装金币的数组
	obs1=[],obs2=[];//装障碍物的数组
	zt_bol=true;
	chong_num=0;//冲刺次数重置
	chongci_bol=true;
	chongci_bol1=false;
	click.style.display="none";
	chong.style.display="none";
	power_num.innerHTML=0+"%";
	power_box.style.width=0+"px";
	
	hero.rindex=0;
	hero.rindex2=0;
	//起跳
	hero.jindex=0;
	hero.jindex2=0;
	hero.jindex3=0;
	hero.jindex4=0;
	//趴下
	hero.tindex=0;
	hero.jbol1=true;
	hero.jbol2=true;
	hero.type=1;
	hero.x=170;
	hero.y=dH*0.55;
	
	prop.index2=0;
	ebol=false;
}
//游戏结束
function gameOver(){
	die.style.display="block";
	zt_bol=false;
}

var bg_v=4;//背景速度
var dis_v=0;//距离速度
var gold_v=5;//金币速度
//帧动画
function move(){
	if(kobe==1){
		if(zt_bol){
			if(num%1000==0){
				bg_v+=0.5;
				gold_v+=(0.5*1.25);
			}
			if(num%4000==0){
				dis_v++;
			}
			//过5帧算一米
			if(num%5==0){
				if(ebol){
					dis.value+=dis_v*3;
				}else{
					dis.value+= dis_v;
				}
			}
			//分数，距离转化为图片
			changeImg(score.value,dis.value);
			
//			obstr1();
			num++;
			ctx.clearRect(0,0,dW,dH);
			if(ebol){
				bg_index+=bg_v*3;
			}else{
				bg_index+=bg_v;
			}
			allBg();
			//先画人
			
			//随机出上方或者下方障碍物
			if(num%100==0){
				var ran=rnd(1,10);
				setTimeout(function(){
					gold_bol=true;
				},500)
				gold_bol=false;
				if(ran<=4){
					var obs=new obstr1();
					obs1.push(obs);
				}else{
					var fir=new obstr2(rnd(1,6));
					obs2.push(fir);
				}
			}
			if(num%10==0){
				if(gold_bol){
					var golden=new gold();
					goldArr.push(golden);
				}
			}
	
			//金币动起来
			for (var i=0;i<goldArr.length;i++) {
				
				if(ebol){
					goldArr[i].x-=gold_v*3;
				}else{
					goldArr[i].x-=gold_v;
				}
				if(goldArr[i].x<=-goldArr[i].width){
					goldArr.splice(i,1);
					i--;
					continue
				}
				goldArr[i].draw();
				var result=goldArr[i].hitTestObject(hero);
				//撞到金币
				if(result){
					score.value+=10;
					goldArr.splice(i,1);
					i--;
				}
			}
			//上方障碍物动起来
			for (var j=0;j<obs1.length;j++) {
				if(ebol){
					obs1[j].x-=gold_v*3;
				}else{
					obs1[j].x-=gold_v;
				}
				if(obs1[j].x<=-obs1[j].width){
					obs1.splice(j,1);
					j--;
					continue
				}
				obs1[j].draw();
//				var result=obs1[j].hitTestObject(hero);
//				if(result){
//					if(hero.type==5){
//						//冲刺模式
//						console.log("撞死上上上上障碍物");
//					}else{
//						console.log("撞到上面");
//					}
//				}
			}
			//下方障碍物动起来
			for (var k=0;k<obs2.length;k++) {
				if(ebol){
					obs2[k].x-=gold_v*3;
				}else{
					obs2[k].x-=gold_v;
				}
				if(obs2[k].x<=-obs2[k].nwidth){
					obs2.splice(k,1);
					k--;
					continue
				}
				obs2[k].draw();
//				var result=obs2[k].hitTestObject(hero);
//				if(result){
//					if(hero.type==5){
//						//冲刺模式
//						console.log("撞死下方障碍物");
//					}else{
//						alert();
//						console.log("撞到下面");
//					}
//				}
			}
			hero.run();
			//问题：延迟了一帧
			//上方障碍物动起来
			for (var t=0;t<obs1.length;t++) {
				var result=obs1[t].hitTestObject(hero);
				if(result){
					if(hero.type==5){
						//冲刺模式
//						console.log("撞死上上上上障碍物");
						obs1.splice(t,1);
						t--;
						
					}else{
//						console.log("撞到上面");
						gameOver();
					}
				}
			}
			//下方障碍物动起来
			for (var x=0;x<obs2.length;x++) {
				var result=obs2[x].hitTestObject(hero);
				if(result){
					if(hero.type==5){
						//冲刺模式
//						console.log("撞死下方障碍物");
						obs2.splice(x,1);
						x--;
					}else{
//						console.log("撞到下面");
						gameOver();
					}
				}
			}
            
			if(ebol){
				daoju.draw();
			}
		}
	}
	if(kobe==2){
		if(num2%120==0){
			//位置
			var x=rnd(150,dW-150),y=rnd(200,dH-100);
			for (var i=0;i<10;i++) {
				var ball1 = new ball(x,y);
				ballarr.push(ball1);
				setTimeout(function(){
					ballarr.shift()
				},1500)
			}
		}
		num2++;
		
		ctx2.clearRect(0,0,dW,dH)
		for(var i = 0;i < ballarr.length;i++){
			ballarr[i].draw();
			var x = ballarr[i].x + ballarr[i].speedx;
			var y = ballarr[i].y + ballarr[i].speedy;
			ballarr[i].x = x;
			ballarr[i].y = y;
		}
	}
	window.requestAnimationFrame(move);
}
move();

//星星
function ball (x,y) {
	var rn2 = (rnd(0,1)?-1:1)*rnd(1,6);
	this.x = x;
	this.y = y;
	this.speedx=rn2;
	this.speedy=rnd(-20,-15);
	this.clipX=rnd(0,5);
	this.obj=star;
	this.scale=40;
}
ball.prototype.draw = function () {
	this.speedy+=0.5;
	this.scale+=0.8;
	if(this.scale>=150){
		this.scale=150
	}
	ctx2.drawImage(star,this.clipX*50,0,40,40,this.x,this.y,this.scale,this.scale);
}


pm_box.addEventListener("touchmove",function(e){
	move_bol=false;
	e.stopPropagation();
})

document.addEventListener("touchmove",function(e){
	move_bol=true;
	if(move_bol){
		e.preventDefault();
	}
})

function rnd(min,max){
	return Math.round(Math.random()*(max-min)+min)
}