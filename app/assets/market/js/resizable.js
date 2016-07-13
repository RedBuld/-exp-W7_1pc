var curWidth=200;
var newWidth=200;
var curPos=0;
var newPos=0;
var mouseStatus='up';

function resizable(obj){
  columns = $(obj).find( '.left_column:not(.resiz)' );
  columns.addClass('resiz');
  resizer = $('<div></div>',{
    class: 'resizer'
  });
  columns.append(resizer);
  columns.css('width',newWidth);
  $('.resizer')
    .on('mousedown',function(){
      setPos(event);
    });
  $('body').on('mousemove',function(){
      getPos(event);
    })
    .on('mouseup',function(){
      mouseStatus='up'
    })
}
function setPos(e,obj){ 
  curevent=(typeof event=='undefined'?e:event);
  mouseStatus='down';
  curPos=curevent.clientX;
  tempWidth=$('.resiz').css('width');
  widthArray=tempWidth.split('px');
  curWidth=parseInt(widthArray[0]);
}

function getPos(e,obj){ 
  if(mouseStatus=='down')
  { 
    curevent=(typeof event=='undefined'?e:event) 
    newPos=curevent.clientX;
    var pxMove = parseInt(newPos-curPos);
    newWidth = parseInt(curWidth+pxMove);
    newWidth=(newWidth<30?30:newWidth);
    newWidth=(newWidth>450?450:newWidth);
    newWidth=(newWidth>190&&newWidth<210?200:newWidth);
    $('.resiz').css('width',newWidth+'px');
  }
}