/*///*/
opened_windows = [];
noti = 0;
verify = 1;
/*///*/
$(document).ready(function(){
	time();date();
	setInterval(time,1000);
	setInterval(time,60000);
	menu_links();all_to_sh_auto();rshort();AeroGlassEffect();
})
time = function(){
	var clck = new Date();
	var hrs = clck.getHours();
	var min = clck.getMinutes();
	if(min<10)
		min = "0"+min;
	$('#clock').html(hrs+':'+min);
}
date = function()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	if(day<10)
		day = "0"+day;
	if(month<10)
		month = "0"+month;
	$('#date').html(day+'.'+month+'.'+year);
}
menu_links = function()
{
	$('#menu #left_mn_blc li').on('click',function(){
		cat_num = $(this).attr('d-cat');
		cat_img = $(this).find('img').attr('src');
		menu();
		open_window(cat_num,cat_img);
	});
	$('#tray .cart').on('click',function(){
		open_cart_window();
	});
}
open_window = function(cat_num, cat_img)
{
	if( $('.container div').is( '#cat'+cat_num ) )
	{
		change_window(cat_num);
		reactivate_shortcuts(cat_num);
		return;
	}
	nwindow = $('<div></div>', {
		class: 'window',
		'd-cat': cat_num,
		id: 'cat'+cat_num
	});
	controls = $('<div></div>', {
		class: 'controls',
		'd-cat': cat_num
	}).load('/controls/'+cat_num);
	subcont = $('<div></div>', {
		class: 'subcontainer'
	});
	hormenu = $('<div></div>', {
		class: 'hormenu'
	});
	left_column = $('<div></div>', {
		class: 'left_column'
	});
	content = $('<div></div>', {
		class: 'content'
	}).load('/cat/'+cat_num);
	blurred_bg = $('<div></div>', {
		class: 'blurred_bg',
	}).css('background-image', $('body').css('background-image'));
	blurred_bg_color = $('<div></div>', {
		class: 'blurred_bg_color'
	});
	shortcut = $('<div></div>', {
		class: 'back_sc_grad',
		'd-cat': cat_num
	});
	sc_img_d = $('<div></div>', {
		class: 'shortcut run',
	});
	sc_img = $('<img>', {
		src: cat_img
	});
	sc_img_d.append(sc_img);
	shortcut.append(sc_img_d);
	$('#shortcuts').append(shortcut);
	$('.container div.window').css('display','none');
	$('.container').append(nwindow.prepend(controls).append(subcont.prepend(hormenu.append('<ul><li>Упорядочить<span class="da"></span></li></ul>')).append(left_column).append(content)).append(blurred_bg.append(blurred_bg_color)));
	fill_left_column(cat_num); reactivate_shortcuts(cat_num); shortcuts_reaction(); closeNhide(); resizable('.container'); clickBg(); activew = cat_num; AeroGlassEffect();
}
fill_left_column = function(num)
{
	$.ajax({
		method: "GET",
		url: '/cats',
		dataType: 'json',
		success: function(data){
			$('.window#cat'+num+' .left_column').html('<ul><li class="ttl"><span class="micon"><img src="static/market/icons/popular.png"></span>Популярные</li></ul>');
			for(i in data)
			{
				$('.window#cat'+num+' .left_column ul').append('<li d-cat="'+data[i]['id']+'" p-cat="'+num+'"><span class="micon"><img src="static/market/icons/'+data[i]['icon']+'"></span>'+data[i]['name']+'</li>');
			}
			popular();
		}
	});
}
popular = function(){
	$('.left_column').off('click', 'li:not("ttl")').on('click', 'li:not("ttl")', function(){
		var cat_num = $(this).attr('d-cat');
		var cat_img = $(this).find('img').attr('src');
		var parentz = $(this).attr('p-cat');
		if( $('.container div').is( '#cat'+cat_num ) )
		{
			change_window(cat_num);
			reactivate_shortcuts(cat_num);
			return;
		}
		$('.back_sc_grad[d-cat="'+parentz+'"]').attr('d-cat',cat_num).find('img').attr('src',cat_img);
		$('.window[d-cat="'+parentz+'"]').attr('d-cat',cat_num).attr('id','cat'+cat_num);
		$('.controls[d-cat="'+parentz+'"]').attr('d-cat',cat_num).load('/controls/'+cat_num);
		$('.window[d-cat="'+cat_num+'"] .content').load('/cat/'+cat_num);
		fill_left_column(cat_num); shortcuts_reaction(); clickBg(); activew = cat_num;
	});
}
open_mini_window = function(obj)
{
	prd_num = obj.attr('d-id');
	wprd_num = 'w_'+prd_num;
	wprd_img = $('li[d-id="'+prd_num+'"] img').attr('src');
	if( $('.container div').is( '#cat'+wprd_num ) )
	{
		change_window(wprd_num);
		reactivate_shortcuts(wprd_num);
		return;
	}
	miniwindow = $('<div></div>', {
		class: 'window mini',
		'd-cat': wprd_num,
		id: 'catw_'+prd_num
	});
	controls = $('<div></div>', {
		class: 'controls mini',
		'd-cat': wprd_num
	}).load('/controls_mini/'+prd_num);
	subcont = $('<div></div>', {
		class: 'msubcontainer'
	}).append('<button class="mwbuttons cancel">Отмена</button><button class="mwbuttons" onclick="add_to_cart('+prd_num+');">Купить</button>');
	content = $('<div>', {
		class: 'content mini'
	}).load('/prd/'+prd_num);
	blurred_bg = $('<div></div>', {
		class: 'blurred_bg mini',
	}).css('background-image', $('body').css('background-image'));
	var bg_prop = {
		left : 0,
		top : 40,
		width : $(window).width(),
		height : $(window).height()
	};
	blurred_bg_cont = $('<div></div>', {
		class: 'blurred_bg_cont mini'
	}).html('').html($('.container .window:not(.mini):visible').html()).css(bg_prop);
	blurred_bg_color = $('<div></div>', {
		class: 'blurred_bg_color'
	});
	shortcut = $('<div></div>', {
		class: 'back_sc_grad',
		'd-cat': wprd_num
	});
	sc_img_d = $('<div></div>', {
		class: 'shortcut run',
	});
	sc_img = $('<img>', {
		src: wprd_img,
		width: 32,
		height: 32
	});
	sc_img_d.append(sc_img);
	shortcut.append(sc_img_d);
	$('.container div.window.mini').css('display','none');
	$('#shortcuts').append(shortcut);
	$('.container').append(miniwindow.prepend(controls).append(subcont.prepend(content).prepend('<ul class="tabs_cp"><li class="tab active" d-tab="'+ prd_num +'" d-type="it">Информация</li><li class="tab" d-tab="'+ prd_num +'" d-type="mt">Подробнее</li><li class="tab" d-tab="'+ prd_num +'" d-type="ct">Комментарии</li></ul></div>')).append(blurred_bg.append(blurred_bg_cont,blurred_bg_color)));
	reactivate_shortcuts(wprd_num); shortcuts_reaction(); closeNhide(); activew = wprd_num; AeroGlassEffect(); setMiniBlurredBg(); tabz();
}
open_cart_window = function()
{
	cart = 'cart';
	if( $('.container div').is( '#cat'+cart ) )
	{
		change_window(cart);
		reactivate_shortcuts(cart);
		return;
	}
	cartwindow = $('<div></div>', {
		class: 'window medium',
		'd-cat': cart,
		id: 'catcart'
	});
	controls = $('<div></div>', {
		class: 'controls medium',
		'd-cat': cart
	}).load('/controls_medium');
	subcont = $('<div></div>', {
		class: 'msubcontainer'
	}).append('<button class="mwbuttons checkout">Оформить</button><button class="mwbuttons cancel">Отмена</button>');
	content = $('<div></div>', {
		class: 'content medium'
	});
	blurred_bg = $('<div></div>', {
		class: 'blurred_bg medium',
	}).css('background-image', $('body').css('background-image'));
	var bg_prop = {
		left : 0,
		top : 40,
		width : $(window).width(),
		height : $(window).height()
	};
	blurred_bg_cont = $('<div></div>', {
		class: 'blurred_bg_cont medium'
	}).html('').html($('.container .window:not(.medium):visible').html()).css(bg_prop);
	blurred_bg_color = $('<div></div>', {
		class: 'blurred_bg_color'
	});
	shortcut = $('<div></div>', {
		class: 'back_sc_grad',
		'd-cat': cart
	});
	sc_img_d = $('<div></div>', {
		class: 'shortcut run',
	});
	sc_img = $('<img>', {
		src: 'static/market/icons/cart.png',
		width: 32,
		height: 32
	});
	loader = $('<img>', {
		src: "static/market/css/img/loader.gif",
		class : 'loader'
	})
	sc_img_d.append(sc_img);
	shortcut.append(sc_img_d);
	$('.container div.window.medium').css('display','none');
	$('#shortcuts').append(shortcut);
	$('.container').append(cartwindow.prepend(controls).append(subcont.prepend(content.append(loader))).append(blurred_bg.append(blurred_bg_cont,blurred_bg_color)));
	reactivate_shortcuts(cart); shortcuts_reaction(); closeNhide(); activew = cart; AeroGlassEffect(); setMiniBlurredBg(); tabz(); update_cart(); createOrder();
}
reactivate_shortcuts = function(cn){
	$('#shortcuts .shortcut.open').removeClass('open').addClass('run');
	$('#shortcuts div[d-cat='+cn+'] div.shortcut').removeClass('run').addClass('open');
	mvBgSc();
}
change_window = function(cn){
	$('.container div.window').css('display','none');
	$('.container div#cat'+cn).css('display','block');
	setMiniBlurredBg();
	activew = cn;
}
change_window_m = function(cn){
	$('.container .window.mini').css('display','none');
	$('.container div#cat'+cn).css('display','block');
	setMiniBlurredBg();
	activew = cn;
}
change_window_cart = function(cn){
	$('.container .window.medium').css('display','none');
	$('.container div#cat'+cn).css('display','block');
	setMiniBlurredBg();
	activew = cn;
}
shortcuts_reaction = function(){
	$('.back_sc_grad').off('click').on('click', function(){
		cn = $(this).attr('d-cat');
		if(cn!='cart')
		{
			if( $('.container div#cat'+cn).is(':visible') )
			{
				$('.container div#cat'+cn).css('display','none');
				$('#shortcuts .shortcut.open').removeClass('open').addClass('run');
				allhide = 1;
				if(!/w_[0-9]+/.test(cn)){
					cn = $('.container div.window:not(.mini):visible').attr('d-cat');
					allhide = 0;
				}
				setMiniBlurredBg();
				reactivate_shortcuts(cn);
				activew = cn;
			}else{
				if(!/w_[0-9]+/.test(cn)){
					change_window(cn);
					reactivate_shortcuts(cn);
					activew = cn;
					allhide = 0;
				} else {
					reactivate_shortcuts(cn);
					change_window_m(cn);
					activew = cn;
					allhide = 0;
				}
			}
		}else{
			if( $('.container div#catcart').is(':visible') )
			{
				$('.container div#catcart').css('display','none');
				$('#shortcuts .shortcut.open').removeClass('open').addClass('run');
				allhide = 1;
				if(!/cart/.test(cn)){
					cn = $('.container div.window:not(.mini):visible').attr('d-cat');
					allhide = 0;
				}
				setMiniBlurredBg();
				reactivate_shortcuts(cn);
				activew = cn;
			}else{
				change_window_cart(cn);
				reactivate_shortcuts(cn);
				setMiniBlurredBg();
				activew = cn;
				allhide = 0;
			}
		}
	});
}
closeNhide = function(){
	$('.window').off('click', '.cclose').on('click', '.cclose', function(){
		catw = $(this).parent().parent().attr('d-cat');
		$('.window#cat'+catw).remove();
		$('#shortcuts div[d-cat='+catw+']').remove();
		setMenuBlurredBg(); setMiniBlurredBg();
		if(!/w_[0-9]+/.test(catw) && !/cart/.test(catw) ){
			cn = $('.container div.window:not(.mini):visible').attr('d-cat');
			reactivate_shortcuts(cn);
		}
	});
	$('.window').off('click', '.cancel').on('click', '.cancel', function(){
		catw = $(this).parent().parent().attr('d-cat');
		$('.window#cat'+catw).remove();
		$('#shortcuts div[d-cat='+catw+']').remove();
		setMenuBlurredBg(); setMiniBlurredBg();
		if(!/w_[0-9]+/.test(catw) && !/cart/.test(catw) ){
			cn = $('.container div.window:not(.mini):visible').attr('d-cat');
			reactivate_shortcuts(cn);
		}
	});
	$('.window').off('click', '.chide').on('click', '.chide', function(){
		catw = $(this).parent().parent().attr('d-cat');
		$('.window#cat'+catw).css('display','none');
		$('#shortcuts div[d-cat='+catw+'] div.shortcut').removeClass('open').addClass('run');
		setMenuBlurredBg(); setMiniBlurredBg();
		if(!/w_[0-9]+/.test(catw) && !/cart/.test(catw) ){
			cn = $('.container div.window:not(.mini):visible').attr('d-cat');
			reactivate_shortcuts(cn);
		}
	});
}
/**/
all_to_sh = function(){
	$('#short_cats').toggle();
	$('#all_cats').toggle();
	$('#all_sh t').toggle();
	if($('#all_sh span').is('.r_arrow'))
	{
		$('.r_arrow').removeClass('r_arrow').addClass('l_arrow');
	}else if($('#all_sh span').is('.l_arrow'))
	{
		$('.l_arrow').removeClass('l_arrow').addClass('r_arrow');
	}
}
all_to_sh_auto = function(){
	var a;
	$('#all_sh').on('mouseenter', function(){
		a = setTimeout(all_to_sh,1500);
	});
	$('#all_sh').on('mouseleave', function(){
		clearTimeout(a);
	});
	$('#all_sh').on('click', function(){
		all_to_sh(); clearTimeout(a);
	});
}
rshort = function(){
	var b;
	$('#menu .rshort li').on('mouseenter', function(){
		var ex = $(this);
		b = setTimeout(function(){
			icon = 'static/market/icons/'+ex.attr('d-icon');
			$('#div_icon .big_icon img').attr('src',icon);
		}, 500);
	});
	$('#menu .rshort li').on('mouseleave', function(){
		clearTimeout(b)
		setTimeout(function(){
			$('#div_icon .big_icon img').attr('src','static/market/icons/top_avatar.png');
		}, 500);
	})
}
tabz = function(){
	$('body').off('click', '.tabs_cp li').on('click', '.tabs_cp li', function(){
		var prd_id = $(this).attr('d-tab');
		var tab_type = $(this).attr('d-type');
		$('li[d-tab="'+prd_id+'"]').removeClass('active');
		$(this).addClass('active');
		$('.tab_pane.tactive').removeClass('tactive');
		$('.'+tab_type+prd_id).addClass('tactive');
	})
}
/**/
add_to_cart = function(id) {
	$('body').addClass('busy');
	$.ajax({
		method: "GET",
		url: '/add_product/'+id,
		success: function(data){
			if (data=='true') {
				update_cart();
				notification('Продукт добавлен в корзину');
				$('body').removeClass('busy');
			}
		}
	})
}
remove_from_cart = function(id) {
	$('body').addClass('busy');
	$.ajax({
		method: "GET",
		url: '/delete_product/'+id,
		success: function(data){
			if (data=='true') {
				update_cart();
				notification('Продукт удален из корзины');
				$('body').removeClass('busy');
			}
		}
	})
}
update_cart = function() {
	$('#catcart .content').html('<img class="loader" src="static/market/css/img/loader.gif">')
	$('#catcart .content').load('/cart');
	$('#catcart .crtorder').removeClass('crtorder').addClass('checkout');
	$('#catcart').off('click', '.pmbuttons').on('click', '.pmbuttons', function(){
		if($(this).attr('d-type')=='add')
			add_to_cart($(this).attr('d-id'));
		if($(this).attr('d-type')=='remove')
			remove_from_cart($(this).attr('d-id'));
	})
	createOrder();
}
notification = function(text)
{
	if(noti)
	{
		clearTimeout(nhide);
		noti = 0;
	}
	$('.notification').stop();
	$('.notification').remove();
	$('.notification .nclose').off('click');
	$('#tray').append('<span class="notification">'+text+'<span class="nclose"></span></span>');
	nhide = setTimeout(function(){
		$('.notification').animate({opacity: 0},1000,
			function(){
				$('.notification').off('click');
				$('.notification').remove();
				clearTimeout(nhide);
				noti = 0;
			});
	}, 2000);
	noti = 1;
	$('.notification').hover(
		function(){
			clearTimeout(nhide);
			noti = 0;
			$('.notification').stop();
			$('.notification').css('opacity','1');
		},
		function(){
			nhide = setTimeout(function(){
				$('.notification').animate({opacity: 0},1000,
					function(){
						$('.notification').off('click');
						$('.notification').remove();
						clearTimeout(nhide);
						noti = 0;
					});
			}, 2000);
			noti = 1;
		}
	);
	$('.notification').on('click',function(){
		open_cart_window();
	});
	$('.notification .nclose').on('click',function(){
		clearTimeout(nhide);
		$('.notification').off('click');
		$('.notification').remove();
		$('.notification .nclose').off('click');
		noti = 0;
	});
}
createOrder = function() {
	$('.checkout').off('click').on('click', function(){
		$('#catcart .content').html(createOrderForm);
		getStreets();
		$('#catcart .checkout').removeClass('checkout').addClass('crtorder');
		$('#catcart .crtorder').off('click').on('click', function(){
			var data = {};
			data['name'] = $('#catcart .content #pname')[1].value;
			data['phone'] = $('#catcart .content #pphone')[1].value;
			data['email'] = $('#catcart .content #pmail')[1].value;
			data['street'] = $('#catcart .content #pstreet')[1].value;
			data['house'] = $('#catcart .content #phouse')[1].value;
			data['apartment'] = $('#catcart .content #papartment')[1].value;
			if(verified()){
				$.ajax({
					url: '/order_create',
					method: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json;charset=UTF-8',
					dataType: 'JSON',
					success: function(response){
						if(response['status']=='true')
						{
							$('#catcart .content').html('<div class="code_white">Код вашего заказа: <span>'+response['key']+'</span></div>');
							$('#catcart .crtorder').attr('disabled','disabled');
							$('#catcart .cancel').html('Закрыть');
						}else{
							$('#catcart .content .alert_message').remove();
							alertMes = $('<div></div>',{
								class: 'alert_message'
							}).append('<img src="/static/market/css/img/alert.png" alt="Внимание">Ваша корзина пуста.');
							$('#catcart .content').append(alertMes);
						}
					}
				})
			}else{
				$('#catcart .content .alert_message').remove();
				alertMes = $('<div></div>',{
					class: 'alert_message'
				}).append('<img src="/static/market/css/img/alert.png" alt="Внимание">Ошибка при вводе данных');
				$('#catcart .content').append(alertMes);
			}
		})
	});
}
verified = function(){
	verify = 1;
	if ($('#catcart .content #pname')[1].value=='') {
		verify = 0;
		console.log($('#catcart .content #pname')[1].value);
	};
	if ($('#catcart .content #pphone')[1].value.length<6) {
		verify = 0;
		console.log($('#catcart .content #pphone')[1].value);
	};
	if ($('#catcart .content #pmail')[1].value!='' && !/[A-Za-z0-9.\-]{0,}@[A-Za-z0-9.\-]{1,}/.test($('#catcart .content #pmail')[1].value)) {
		verify = 0;
		console.log($('#catcart .content #pmail')[1].value);
	};
	if ($('#catcart .content #pstreet')[1].value=='') {
		verify = 0;
		console.log($('#catcart .content #pstreet')[1].value);
	};
	if ($('#catcart .content #phouse')[1].value=='') {
		verify = 0;
		console.log($('#catcart .content #phouse')[1].value);
	};
	if ($('#catcart .content #papartment')[1].value=='') {
		verify = 0;
		console.log($('#catcart .content #papartment')[1].value);
	};
	return verify;
}
/**/
createOrderForm = function() {
	var form, formG, inp, lab;
	form = $('<form></form>',{
		role: 'form',
		id: 'order_form'
	});
	lab = $('<label></label>').attr('for', 'name').text('Ваше имя: ').addClass('form-group');
	inp = $('<input>', {
		type: 'text',
		id: 'pname',
		name: 'name',
		required: 'required',
		onchange: 'verified()'
	}).addClass('form-control');
	form.append(lab).append(inp);
	lab = $('<label></label>').attr('for', 'phone').text('Телефон: ').addClass('form-group');
	inp = $('<input>', {
		type: 'text',
		id: 'pphone',
		name: 'phone',
		required: 'required',
		maxlength: '12',
		onchange: 'verified()'
	}).addClass('form-control');
	form.append(lab).append(inp);
	lab = $('<label></label>').attr('for', 'mail').text('Email: ').addClass('form-group');
	inp = $('<input>', {
		type: 'text',
		id: 'pmail',
		name: 'mail',
		onchange: 'verified()'
	}).addClass('form-control');
	form.append(lab).append(inp);
	lab = $('<label></label>').attr('for', 'address').text('Улица: ').addClass('form-group');
	sel = $('<select>', {
		id: 'pstreet',
		name: 'street',
		required: 'required',
		onchange: 'verified()'
	}).attr('placeholder', 'Улица').attr('style','width:75%;float: right;margin: 8px 12px 8px 12px;height: 20px;').append('<option value=""></option>');
	form.append(lab).append(sel);
	lab = $('<label></label>').attr('for', 'house').text('Дом: ').addClass('form-group');
	inp = $('<input>', {
		type: 'text',
		id: 'phouse',
		name: 'house',
		required: 'required',
		onchange: 'verified()'
	}).addClass('form-control');
	form.append(lab).append(inp);
	lab = $('<label></label>').attr('for', 'apartment').text('Квартира: ').addClass('form-group');
	inp = $('<input>', {
		type: 'text',
		id: 'papartment',
		name: 'apartment',
		required: 'required',
		onchange: 'verified()'
	}).addClass('form-control');
	form.append(lab).append(inp);
	return form;
};
getStreets = function()
{
	$.ajax({
		url: 'http://'+window.location.hostname+'/get_streets',
		dataType: 'json',
		success: function(data)
		{
			for(var i in data)
			{
				$('#catcart #pstreet').append('<option value="'+data[i]['name']+'">'+data[i]['name']+'</option>');
			}
			$('#catcart #pstreet').select2();
		}
	})
}
setPhone = function(){
	
	//// ---> Проверка на существование элемента на странице
	jQuery.fn.exists = function() {
	   return jQuery(this).length;
	}
	
	//	Phone Mask
	$(function() {
		
    if(!is_mobile()){
    
      if($('#catcart #ptel').exists()){
        
        $('#catcart #ptel').each(function(){
          $(this).mask("999 999-99-99");
        });
        $('#catcart #ptel')
          .addClass('rfield')
          .removeAttr('required')
          .removeAttr('pattern')
          .removeAttr('title')
          .attr({'placeholder':'___ ___ __ __'});
      }
      
      if($('.phone_form').exists()){
        
        var form = $('.phone_form'),
          btn = form.find('.btn_submit');
        
        form.find('.rfield').addClass('empty_field');
      
        setInterval(function(){
        
          if($('#catcart #ptel').exists()){
            var pmc = $('#catcart #ptel');
            if ( (pmc.val().indexOf("_") != -1) || pmc.val() == '' ) {
              pmc.addClass('empty_field');
            } else {
                pmc.removeClass('empty_field');
            }
          }
          
          var sizeEmpty = form.find('.empty_field').size();
          
          if(sizeEmpty > 0){
            if(btn.hasClass('disabled')){
              return false
            } else {
              btn.addClass('disabled')
            }
          } else {
            btn.removeClass('disabled')
          }
          
        },200);

        btn.click(function(){
          if($(this).hasClass('disabled')){
            return false
          } else {
            form.submit();
          }
        });
        
      }
    }

	});
}