/*///*/
var bg = 1;
allhide = 0;
activew = 0;
/*///*/
$(document).ready(function(){
	setInterval(change,8000);
	header_hide();
	$('#menu_but').on('click',function(){menu();});
	$(window).on('resize',function(){setMenuBlurredBg();setMiniBlurredBg();AeroGlassEffect();});
});
function change() {
	bg++;
	$('body').css('background-image','url(http://'+window.location.hostname+'/static/market/css/img/'+bg+'.jpg)');
	$('#header_bg_blur').css('background-image','url(http://'+window.location.hostname+'/static/market/css/img/'+bg+'.jpg)');
	$('#menu .blurred #blurred_bg').css('background-image','url(http://'+window.location.hostname+'/static/market/css/img/'+bg+'.jpg)');
	$('.window .blurred_bg').css('background-image','url(http://'+window.location.hostname+'/static/market/css/img/'+bg+'.jpg)');
	if(bg==8)
		bg=0;
}
function header_hide()
{
	$('#header_hide').on('click', function(){
		if( $('.container div.window').is(':visible') )
		{
			if(!allhide)
			{
				$('.container div.window').css('display','none');
				$('#shortcuts .shortcut.open').removeClass('open');
				allhide = 1;
			}
		}else{
			$('.container div#cat'+activew).css('display','block');
			$('#shortcuts div[d-cat='+activew+'] div.shortcut').removeClass('run').addClass('open');
			allhide = 0;
		}
	})
}
/*menu*/
function menu(){
	if($('#menu').css('display')!='none')
	{
		$('#menu').css('display','none');
		$('#menu_but').removeClass('open');
		$('.menu_hover').remove();
	}else{
		$('#menu').css('display','block');
		$('#menu_but').addClass('open');
		$('body').append('<div class="menu_hover" onclick="menu()"></div>');
	}
	setMenuBlurredBg();
}
function setMenuBlurredBg(){
	var bg_prop = {
		width : $(window).width(),
		height : $(window).height()
	};
	$('#blurred_cont').css( bg_prop );
	$('#menu #blurred_cont').html('').html($('.container').filter(' :visible').html());
	setMiniBlurredBg();
}
function setMiniBlurredBg(){
	var bg_cnt_prop = {
		left : -$(window).width()/2+200,
		top : -$(window).height()/2+290,
		width : $(window).width(),
		height : $(window).height()
	};
	var bg_cnt_prop2 = {
		left : -$(window).width()/2+200,
		top : -$(window).height()/2+250,
		width : $(window).width(),
		height : $(window).height()
	};
	var bg_cnt_prop3 = {
		left : -$(window).width()/2+300,
		top : -$(window).height()/2+250,
		width : $(window).width(),
		height : $(window).height()
	};
	var bg_prop = -$(window).height()/2 + 40;
	if( ($(window).height()/2-250) <= 40 )
	{
		$('.window.mini').css('top','40px');
		$('.window.medium').css('top','40px');
		$('#menu .window.mini').css('top','-1px');
		$('#menu .window.medium').css('top','-1px');
	}else{
		$('.window.mini').css('top','calc(50% - 250px)');
		$('.window.medium').css('top','calc(50% - 250px)');
		$('#menu .window.mini').css('top','calc(50% - 291px)');
		$('#menu .window.medium').css('top','calc(50% - 291px)');
		$('.window.mini .blurred_bg.mini').css( bg_cnt_prop2 );
		$('.window.medium .blurred_bg.medium').css( bg_cnt_prop3 );
	}
	$('.blurred_bg_cont.mini').html(' ').html($('.container .window:not(.mini):visible').html());
	$('.blurred_bg_cont.medium').html(' ').html($('.container .window:not(.medium):visible').html());
}
function AeroGlassEffect(){
	var bg_prop = {
		width : $(window).width(),
		height : $(window).height()
	};
	$('#header_bg_color').css(bg_prop);
	$('.blurred_bg_color').css(bg_prop);
	$('.blurred_bg').css(bg_prop);
}
/**/
function clickBg(){
	$('body').off('click', '.prd-line li').on('click', '.prd-line li', function(){
		$('.prd-line li.disselected').removeClass('disselected');
		$(this).addClass('active');
		setMiniBlurredBg();
	});
	$('body').off('dblclick', '.prd-line li').on('dblclick', '.prd-line li', function(){
		open_mini_window($(this));
	});
	$('.window :not(.controls)').off('click').on('click', function(){
		$('.prd-line li.active').removeClass('active').addClass('disselected');
		setMiniBlurredBg();
	});
}
/*shortcuts*/
function mvBgSc(){
	var color;
	$('.back_sc_grad').off('mousemove').on('mousemove', function(e) {
		if(!e) e = $(this).event;
		lft = $(this).offset().left;
		if(color=='')
		{
			color = convImg( $(this).find('img').attr('src') );
		}
		x = ( (MouseCoords.getX(e)-lft) / 60 ) * 100;
		$(this).css( 'background-image', '-webkit-radial-gradient('+x+'% 120%,ellipse, rgb(255,255,255) 0%, '+color+' 30%, rgba(255,255,255,0) 90%)' );
	});
	$('.back_sc_grad').off('mouseleave').on('mouseleave',function(){
		$(this).css( 'background-image',''); color = '';
	});
}
var MouseCoords = {
	getX: function(e)
	{
		if (e.pageX)
		{
			return e.pageX;
		}
		else if (e.clientX)
		{
			return e.clientX+(document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft;
		}
		return 0;
	}
}
/**/
function convImg(th) {
    var imgWidth  = 32;
    var imgHeight = 32;
    thx = new Image();
    thx.src=th;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, imgWidth, imgHeight);

    ctx.drawImage( thx, 0, 0, imgWidth, imgHeight);
    try {
        var data = ctx.getImageData(0, 0, imgWidth, imgHeight);
    }
    catch(e) {
        console.log("Cross-domain error");
        return;
    }

    var rgb = avgYUV( data );

    var colorString = String("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.8)");
    return colorString;

}
function avgYUV( data ) {
	var rgb = { r : 0, g : 0, b : 0 };
	var yuv = { y : 0, u : 0, v : 0 };
	var count = 0;
	for ( i = 0; i<data.data.length; i=i+4 ) {
		if ( data.data[i] == 255 && data.data[i + 1] == 255 && data.data[i + 2] == 255 ) {
			continue;
		}
		rgb.r = data.data[i] / 255;
		rgb.g = data.data[i + 1] / 255;
		rgb.b = data.data[i + 2] / 255;

		yuv.y +=  0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
		yuv.u += -0.147 * rgb.r - 0.289 * rgb.g + 0.436 * rgb.b;
		yuv.v +=  0.615 * rgb.r - 0.515 * rgb.g - 0.100 * rgb.b;

		count += 1;
	}

	yuv.y = yuv.y/count;
	yuv.u = yuv.u/count;
	yuv.v = yuv.v/count;

	yuv.y = sigma(yuv.y);
	yuv.u = sigma(yuv.u);
	yuv.v = sigma(yuv.v);

	rgb.r = yuv.y + 1.3983 * yuv.v;
	rgb.g = yuv.y - 0.3946 * yuv.u - 0.58060 * yuv.v;
	rgb.b = yuv.y + 2.0321 * yuv.u;

	rgb.r = ~~(rgb.r * 255);
	rgb.g = ~~(rgb.g * 255);
	rgb.b = ~~(rgb.b * 255);

	return rgb;
}
function sigma( x ) {
	return x / (Math.abs(x) + 0.4);
}