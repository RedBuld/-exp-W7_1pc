Modal = (function() {

  function Modal(title, html, btn, adelete, pause) {
    var i, _i, _len;
    if (adelete == null) {
      adelete = true;
    }
    if (pause == null) {
      pause = 200;
    }
    this["delete"] = adelete;
    this.title = title;
    this.html = html;
    this.pause = pause;
    this.id = '';
    this.btn = '';
    for (_i = 0, _len = btn.length; _i < _len; _i++) {
      i = btn[_i];
      this.btn += i.getHtml();
    }
    return;
  }

  Modal.prototype.create = function() {
    var m, mbody, mfooter, mhead, self;
    this.id = randId();
    mfooter = $('<div></div>').addClass('modal-footer');
    $(mfooter).append(this.btn);
    mbody = $('<div></div>').addClass('modal-body');
    $(mbody).append('<p>' + this.html + '</p>');
    mhead = $('<div></div>').addClass('modal-header');
    $(mhead).append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>' + this.title + '</h3>');
    m = $('<div></div>', {
      id: this.id
    }).addClass('modal hide fade');
    m.append(mhead);
    m.append(mbody);
    m.append(mfooter);
    $('body').append(m);
    if (this["delete"]) {
      self = this;
      $('#' + this.id).on('hide', function() {
        setTimeout(function() {
        	$('#' + self.id).remove();
        }, self.pause);
      });
    }
  };

  Modal.prototype.show = function() {
    $('#' + this.id).modal('show');
    reloadz = false;
  };

  Modal.prototype.remove = function() {
    $('#' + this.id).modal('hide');
    $('#' + this.id).remove();
  };

return Modal;

})();

Btn = (function() {

  function Btn(tag, text, aclass, close) {
    var a;
    if (close == null) {
      close = false;
    }
    this.str = '';
    a = '';
    this.id = randId();
    if (close) {
      a = ' data-dismiss="modal" aria-hidden="true"';
    }
    if (tag === 'a') {
      this.str = '<a href="#" class="btn ' + aclass + '"' + a + '>' + text + '</a>';
    } else {
      this.str = '<button type="button" id="' + this.id + '" class="btn ' + aclass + '"' + a + '>' + text + '</button>';
    }
    return this;
  }

  Btn.prototype.getHtml = function() {
    return this.str;
  };

  Btn.prototype.setOnclick = function(fun) {
    return $('#' + this.id).click(function() {
      fun.call();
    });
  };

  return Btn;

})();

$.fn.exists = function() {
  return this.length > 0;
};

randId = function() {
  var num;
  while (true) {
    num = (Math.random() * 1000).toString().replace('.', '_');
    if (!$('#id_' + num).exists()) {
      return 'id_' + num;
    }
  }
};
