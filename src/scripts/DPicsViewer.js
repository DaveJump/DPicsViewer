/**!
 * DPicsViewer 1.0.0
 * Author: DaveLee(MIT LICENSE)
 */

;(function(window,document){

  function DPicsViewer(wrapper,options){
    var _this = this;
    var wrapBox = wrapper.indexOf('#') ? wrapper.replace('#','') : wrapper;
    this.oWrap = document.getElementById(wrapBox);
    this.imgDatas = [];
    var _options = options || {};
    var defaultOptions = {
      loop: false,
      autoPlay: false,
      autoPlayTime: 5000,
      singleMode: false,
      touchSwitch: true,
      autoResize: false,
      keyControl: false,
      showNav: true
    };
    this.config = Object.extend = (function(target,source){
      for(var p in source){
        if(source.hasOwnProperty(p)){
          target[p] = source[p];
        }
      }
      return target;
    })(defaultOptions,_options);

    this.renderDOM();

    var timer = null;
    this.autoPlayTimer = null;
    this.isPaused = false;
    this.isInited = false;
    this.resizeFlag = true;
    this.toggleFlag = true;

    //autoResize imageBox when resizing window
    if(this.config.autoResize){
      window.addEventListener('resize',function(){
        if(_this.resizeFlag){
          _this.resizeFlag = false;
          window.clearTimeout(timer);
          timer = window.setTimeout(function(){
            window.clearTimeout(_this.autoPlayTimer);
            _this.isPaused = true;
            _this.resize(_this.oImg);
          },400);
        }
      },false);
    }

    //next
    this.next.onclick = function(){
      window.clearTimeout(_this.autoPlayTimer);
      if(_this.toggleFlag){
        _this.toggleFlag = false;
        if(!_this.config.loop){
          if(_this.cindex === _this.imgDatas.length - 1){
            _this.toggleFlag = true;
            return false;
          }
        }else{
          if(_this.cindex === _this.imgDatas.length - 1){
            _this.cindex = -1;
          }
        }
        _this.cindex++;
        _this.goto(_this.cindex);
        return false;
      }
    };

    //prev
    this.prev.onclick = function(){
      window.clearTimeout(_this.autoPlayTimer);
      if(_this.toggleFlag){
        _this.toggleFlag = false;

        if(!_this.config.loop){
          if(_this.cindex === 0){
            _this.toggleFlag = true;
            return false;
          }
        }else{
          if(_this.cindex === 0){
            _this.cindex = _this.imgDatas.length;
          }
        }
        _this.cindex--;
        _this.goto(_this.cindex);
        return false;
      }
    };

    //keyControl
    if(this.config.keyControl && !this.config.singleMode){
      window.addEventListener('keyup', function (e) {
        if (_this.isInited) {
          var evt = e || window.event;
          var keyValue = evt.which;

          if (keyValue == 38 || keyValue == 37) {
            _this.prev.onclick();
          } else if (keyValue == 39 || keyValue == 40) {
            _this.next.onclick();
          }
        }
      }, false);
    }

    //play
    this.play.onclick = function(){
      this.style.display = 'none';
      _this.pause.style.display = 'block';
      _this.isPaused = false;
      _this.autoPlay();
    };

    //pause
    this.pause.onclick = function(){
      _this.play.style.display = 'block';
      this.style.display = 'none';
      _this.isPaused = true;
      window.clearTimeout(_this.autoPlayTimer);
    };

    //touchSwitch
    if(this.config.touchSwitch && !this.config.singleMode){
      this.swipe(this.oBox,function(result){
        switch (result){
          case 'swipeLeft':
            _this.next.onclick();
            break;
          case 'swipeRight':
            _this.prev.onclick();
            break;
        }
      });
    }

    //close
    this.DPicsWrap.onclick = function(e){
      var evt = e || window.event;
      if(evt.target === evt.currentTarget){
        _this.close.onclick();
      }
    };
    this.close.onclick = function(){
      _this.isPaused = true;
      _this.isInited = false;
      _this.DPicsWrap.style.display = 'none';
      _this.DPicsBox.style.opacity = 0;
      _this.DPicsBox.style.width = _this.DPicsBox.style.height = 200 + 'px';
      _this.DPicsBox.style.marginLeft = _this.DPicsBox.style.marginTop = -100 + 'px';
      window.clearTimeout(_this.autoPlayTimer);
      return false;
    }
  }

  DPicsViewer.prototype.swipe = function(obj,callback){
    var startPoint = 0;
    var endPoint = 0;
    var startDate,endDate = null;

    obj.addEventListener('touchmove',function(e){
      var evt = e || window.event;
      evt.preventDefault();
    },false);
    obj.addEventListener('touchstart',function(e){

      var evt = e || window.event;
      startPoint = evt.touches[0].pageX;
      startDate = new Date() * 1;
    },false);
    obj.addEventListener('touchend',function(e){
      var evt = e || window.event;
      endPoint = evt.changedTouches[0].pageX;
      endDate = new Date() * 1;

      if(callback){
        if((endDate - startDate) < 100){
          if((endPoint - startPoint) < 0){
            callback('swipeLeft');
          }else if((endPoint - startPoint) > 0){
            callback('swipeRight');
          }
        }else if((endDate - startDate) < 500){
          if((endPoint - startPoint) < -50){
            callback('swipeLeft');
          }else if((endPoint - startPoint) > 50){
            callback('swipeRight');
          }
        }
      }
    },false);
  };

  DPicsViewer.prototype.autoPlay = function(){
    var _this = this;
    //autoPlay
    if(this.config.autoPlay && this.isInited && !this.config.singleMode){
      this.autoPlayTimer = window.setTimeout(function(){
        _this.next.onclick();
      },_this.config.autoPlayTime);
    }
  };

  DPicsViewer.prototype.init = function(data){
    if(!data || !(data instanceof Array) || data.length < 1){
      throw new Error('error caused when initializing constructor. Initial data should be an [Array] type and it\'s length should be more than one');
    }
    var _this = this;
    this.imgDatas = data;
    var imgItems = this.oWrap.getElementsByTagName('img');
    var realItems = findImgObj();

    function findImgObj(){
      var itemArr = [];
      for(var i = 0;i < imgItems.length;i ++){
        if(imgItems[i].className.indexOf('DPics-item') > -1){
          itemArr.push(imgItems[i]);
        }
      }
      return itemArr;
    }

    realItems.forEach(function(item,idx){
      item.index = idx;
    });

    var initHandler = function(e){
      var evt = e || window.event;
      var target = evt.target;

      if(target === evt.currentTarget){
        return false;
      }else if(target.nodeName === 'IMG' && target.className.indexOf('DPics-item') > -1){
        _this.cindex = parseInt(target.index);
        window.setTimeout(function(){
          _this.DPicsBox.style.opacity = 1;
        },50);
        _this.goto(_this.cindex);
      }
    };
    this.oWrap.removeEventListener('click',initHandler,false);
    this.oWrap.addEventListener('click',initHandler,false);
  };

  DPicsViewer.prototype.goto = function(index){
    var _this = this;
    this.nav.style.opacity = 0;
    this.nav.style.visibility = 'hidden';
    _this.desc.className = 'DPics-desc';
    this.preLoadImg(index,function(oImg){
      _this.loading.style.opacity = 0;
      _this.page.innerHTML = '<i>' + parseInt(_this.cindex + 1) + ' / ' + _this.imgDatas.length + '</i>';
      _this.title.innerHTML = _this.imgDatas[_this.cindex].title || '';
      _this.desc.innerHTML = _this.imgDatas[_this.cindex].desc || '';
      !_this.imgDatas[_this.cindex].desc ? (_this.desc.style.display = 'none') : (_this.desc.style.display = 'block');
      _this.resize(oImg);
    });
    this.DPicsWrap.style.display = 'block';
  };

  DPicsViewer.prototype.preLoadImg = function(index,callback){
    var _this = this;
    var img = new Image();
    this.oImg.style.opacity = 0;
    this.oImg.style.visibility = 'hidden';
    this.loading.style.opacity = 1;

    window.setTimeout(function(){
      _this.oImg.src = img.src = _this.imgDatas[index].src;
      img.onload = function(){
        callback && callback(_this.oImg);
      };
    },300);
  };

  DPicsViewer.prototype.resize = function(oImg){
    var _this = this;
    var clientW = document.documentElement.clientWidth;
    var clientH = document.documentElement.clientHeight;
    oImg.style.width = oImg.style.height = 'auto';
    var w = oImg.width;
    var h = oImg.height;
    var navH = clientW < 470 ? 83 : 45;
    //scale image
    var scale = Math.min(clientW / w ,clientH / h ,1);

    w = scale < 1 ? Math.ceil(w * scale - 60) : Math.ceil(w * scale);
    h = scale < 1 ? Math.ceil(h * scale - 60) : Math.ceil(h * scale);
    oImg.style.width = w + 'px';
    oImg.style.height = h + 'px';
    this.DPicsBox.style.width = w + 'px';
    this.DPicsBox.style.height = this.config.showNav ? h + navH + 'px' : h + 'px';
    this.DPicsBox.style.marginLeft = - (w + 10) / 2 + 'px';
    this.DPicsBox.style.marginTop = this.config.showNav ? (- (h + navH + 10) / 2 + 'px') : (- (h + 10) / 2 + 'px');

    if(_this.isPaused && _this.config.autoPlay){
      _this.play.style.display = 'block';
      _this.pause.style.display = 'none';
    }
    window.setTimeout(function(){
      _this.nav.style.opacity = oImg.style.opacity = 1;
      _this.nav.style.visibility = oImg.style.visibility = 'visible';
      _this.desc.className = 'DPics-desc show-desc';
      _this.resizeFlag = true;
      _this.toggleFlag = true;
      _this.isInited = true;
      !_this.isPaused && _this.autoPlay();
    },500);
  };

  DPicsViewer.prototype.renderDOM = function(){
    this.DPicsWrap = document.createElement('div');
    this.DPicsWrap.id = this.oWrap.id + '-pop';
    this.DPicsWrap.className = 'DPics-wrap';

    this.DPicsBox = document.createElement('div');
    this.DPicsBox.className = 'DPics-box';

    var strDOM = '<div id="'+ this.oWrap.id +'-DPics-imgBox" class="DPics-imgBox">' +
                    '<img id="'+ this.oWrap.id +'-DPics-img">' +
                    '<p id="'+ this.oWrap.id +'-DPics-desc" class="DPics-desc"></p>' +
                 '</div>' +
                 '<div id="'+ this.oWrap.id +'-DPics-loading" class="DPics-loading">' +
                   '<div class="DPics-spinner">' +
                     '<div class="rect1"></div>' +
                     '<div class="rect2"></div>' +
                     '<div class="rect3"></div>' +
                     '<div class="rect4"></div>' +
                     '<div class="rect5"></div>' +
                   '</div>' +
                 '</div>'+
                 '<div id="'+ this.oWrap.id +'-DPics-nav" class="DPics-nav">' +
                    '<div id="'+ this.oWrap.id +'-DPics-close" class="DPics-close"></div>' +
                    '<div class="DPics-control">' +
                      '<div id="'+ this.oWrap.id +'-DPicsPlay" class="DPics-play-pause play"></div>' +
                      '<div id="'+ this.oWrap.id +'-DPicsPause" class="DPics-play-pause pause"></div>' +
                      '<div id="'+ this.oWrap.id +'-DPics-prev" class="DPics-prev-next-btn prev-btn"></div>' +
                      '<div id="'+ this.oWrap.id +'-DPics-next" class="DPics-prev-next-btn next-btn"></div>' +
                      '<span id="'+ this.oWrap.id +'-DPics-page" class="DPics-page"></span>' +
                    '</div>' +
                    '<p id="'+ this.oWrap.id +'-DPics-title" class="DPics-title"></p>' +
                 '</div>';

    this.DPicsWrap.appendChild(this.DPicsBox);
    this.DPicsBox.innerHTML = strDOM;
    document.body.appendChild(this.DPicsWrap);

    function getById(id){
      return document.getElementById(id);
    }

    this.oBox = getById(''+ this.oWrap.id +'-DPics-imgBox');
    this.oImg = getById(''+ this.oWrap.id +'-DPics-img');
    this.nav = getById(''+ this.oWrap.id +'-DPics-nav');
    this.page = getById(''+ this.oWrap.id +'-DPics-page');
    this.title = getById(''+ this.oWrap.id +'-DPics-title');
    this.desc = getById(''+ this.oWrap.id +'-DPics-desc');
    this.prev = getById(''+ this.oWrap.id +'-DPics-prev');
    this.next = getById(''+ this.oWrap.id +'-DPics-next');
    this.play = getById(''+ this.oWrap.id +'-DPicsPlay');
    this.pause = getById(''+ this.oWrap.id +'-DPicsPause');
    this.loading = getById(''+ this.oWrap.id +'-DPics-loading');
    this.close = getById(''+ this.oWrap.id +'-DPics-close');

    if(!this.config.showNav){
      this.nav.style.display = 'none';
    }

    if(this.config.singleMode){
      this.prev.style.display =
      this.next.style.display =
      this.play.style.display = 'none';
    }

    if(!this.config.autoPlay || this.config.singleMode){
      this.play.style.display = this.pause.style.display = 'none';
    }else{
      this.play.style.display = 'none';
      this.pause.style.display = 'block';
    }
  };

  window['DPicsViewer'] = DPicsViewer;

})(window,document);
