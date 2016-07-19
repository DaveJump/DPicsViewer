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
      switchItem: true,
      touchSwitch: true,
      autoResize: true,
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
    this.isPause = false;
    this.isInit = false;
    this.resizeFlag = true;
    this.toggleFlag = true;

    //autoResize imageBox when resizing window
    if(this.config.autoResize){
      window.onresize = function(){
        if(_this.resizeFlag){
          _this.resizeFlag = false;
          window.clearTimeout(timer);
          window.clearInterval(_this.autoPlayTimer);
          timer = window.setTimeout(function(){
            window.setTimeout(function(){
              _this.resize(_this.oImg);
            },300);
          },300);
        }
      }
    }

    //next
    this.next.onclick = function(){
      window.clearInterval(_this.autoPlayTimer);
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
    }

    //prev
    this.prev.onclick = function(){
      window.clearInterval(_this.autoPlayTimer);
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
    }

    //keyControl
    if(this.config.keyControl && this.config.switchItem){
      window.onkeyup = function(e){
        if(_this.isInit){
          var evt = e || window.event;
          var keyValue = evt.which;

          if(keyValue == 38 || keyValue == 37){
            _this.prev.onclick();
          }else if(keyValue == 39 || keyValue == 40){
            _this.next.onclick();
          }
        }
      }
    }

    //play
    this.play.onclick = function(){
      this.style.display = 'none';
      _this.pause.style.display = 'block';
      _this.isPause = false;
      _this.autoPlay();
    }

    //pause
    this.pause.onclick = function(){
      _this.play.style.display = 'block';
      this.style.display = 'none';
      _this.isPause = true;
      window.clearInterval(_this.autoPlayTimer);
    }

    //rotate
    this.rotate.onclick = function(){
      if(_this.toggleFlag){
        _this.toggleFlag = false;
        _this.DPicsItem.className += ' inverse';
        _this.pause.onclick();
        return false;
      }
    }
    this.rotateBackFace.onclick = function(){
      _this.DPicsItem.className = _this.DPicsItem.className.replace(' inverse','');
      window.setTimeout(function(){
        _this.toggleFlag = true;
      },500);
      return false;
    }

    //close
    this.DPicsWrap.onclick = function(e){
      var evt = e || window.event;
      if(evt.target === evt.currentTarget){
        this.style.display = 'none';
        _this.isInit = false;
        _this.DPicsItem.style.width = _this.DPicsItem.style.height = 200 + 'px';
        _this.DPicsItem.style.marginLeft = _this.DPicsItem.style.marginTop = -100 + 'px';
        window.clearInterval(_this.autoPlayTimer);
      }
    }
  }

  DPicsViewer.prototype.autoPlay = function(){
    var _this = this;
    //autoPlay
    if(this.config.autoPlay && this.isInit){
      this.autoPlayTimer = window.setInterval(function(){
        _this.next.onclick();
      },_this.config.autoPlayTime);
    }
  }

  DPicsViewer.prototype.init = function(data){
    var _this = this;
    this.imgDatas = data;
    var imgItems = this.oWrap.getElementsByTagName('li');

    for(var i = 0;i < imgItems.length;i ++){
      imgItems[i].index = i;
      imgItems[i].onclick = function(){
        _this.isInit = true;
        _this.cindex = parseInt(this.index);
        _this.DPicsItem.className = 'DPics-item animated fadeIn';
        _this.goto(_this.cindex);
        return false;
      }
    }
  }

  DPicsViewer.prototype.goto = function(index){
    var _this = this;
    this.nav.style.opacity = 0;
    this.nav.style.visibility = 'hidden';
    function findDOMNode(parent,nodeName){
      var DOMs = parent.children;
      for(var i = 0;i < DOMs.length;i ++){
        if(DOMs[i].nodeName === nodeName){
          return DOMs[i];
        }
      }
    }
    this.preLoadImg(index,function(oImg){
      _this.title.innerHTML = _this.imgDatas[index].title;
      _this.page.innerHTML = '<i>' + parseInt(index + 1) + ' / ' + _this.imgDatas.length + '</i>';

      var desc =  _this.imgDatas[index].desc;
      var descP = findDOMNode(_this.backface,'P');

      if(!descP){
        descP = document.createElement('p');
        descP.innerHTML = desc;
        _this.backface.appendChild(descP);
      }else{
        descP.innerHTML = desc;
      }
      _this.loading.style.opacity = 0;
      _this.resize(oImg);
    });
    this.DPicsWrap.style.display = 'block';
  }

  DPicsViewer.prototype.preLoadImg = function(index,callback){
    var _this = this;
    var img = new Image();
    this.oImg.style.opacity = 0;
    this.oImg.style.visibility = 'hidden';
    this.loading.style.opacity = 1;

    window.setTimeout(function(){
      _this.oImg.src = img.src = _this.imgDatas[index].src;

      if(window.ActiveXObject){
        img.onreadystatechange = function(){
          if(_this.readyState == "complete"){
            callback && callback(_this.oImg);
          }
        }
      }else{
        img.onload = function(){
          callback && callback(_this.oImg);
        };
      }
    },300);
  }

  DPicsViewer.prototype.resize = function(oImg){
    var _this = this;
    var clientW = document.documentElement.clientWidth;
    var clientH = document.documentElement.clientHeight;
    oImg.style.width = 'auto';
    oImg.style.height = 'auto';
    var w = oImg.width;
    var h = oImg.height;

    //scale image
    var scale = Math.min(clientW / w ,clientH / h ,1);

    w = scale < 1 ? Math.ceil(w * scale - 60) : Math.ceil(w * scale);
    h = scale < 1 ? Math.ceil(h * scale - 60) : Math.ceil(h * scale);
    oImg.style.width = w + 'px';
    oImg.style.height = h + 'px';
    this.DPicsItem.style.width = w + 'px';
    this.DPicsItem.style.height = this.config.showNav ? h + 43 + 'px' : h + 'px';
    this.DPicsItem.style.marginLeft = - (w + 10) / 2 + 'px';
    this.DPicsItem.style.marginTop = this.config.showNav ? (- (h + 43 + 10) / 2 + 'px') : (- (h + 10) / 2 + 'px');

    window.setTimeout(function(){
      oImg.style.opacity = 1;
      oImg.style.visibility = 'visible';
      _this.resizeFlag = true;
      _this.toggleFlag = true;
      _this.nav.style.opacity = 1;
      _this.nav.style.visibility = 'visible';
      !_this.isPause && _this.autoPlay();
    },500);
  }

  DPicsViewer.prototype.renderDOM = function(){
    this.DPicsWrap = document.createElement('div');
    this.DPicsWrap.id = this.oWrap.id + '-pop';
    this.DPicsWrap.className = 'DPicsBox';

    this.DPicsItem = document.createElement('div');
    this.DPicsItem.className = 'DPics-item';

    var strDOM = '<div id="DPics-imgBox" class="DPics-imgBox">' +
                    '<img id="DPics-img">' +
                    '<div id="DPics-loading" class="DPics-loading">' +
                      '<div class="DPics-spinner">' +
                        '<div class="rect1"></div>' +
                        '<div class="rect2"></div>' +
                        '<div class="rect3"></div>' +
                        '<div class="rect4"></div>' +
                        '<div class="rect5"></div>' +
                      '</div>' +
                    '</div>'+
                    '<div id="DPics-back-face" class="face-desc">' +
                      '<div id="DPics-rotate-backFace" class="DPics-rotate"></div>' +
                    '</div>' +
                 '</div>' +
                 '<div id="DPics-nav" class="DPics-nav">' +
                    '<div id="DPicsPlay" class="DPics-play-pause play"></div>' +
                    '<div id="DPicsPause" class="DPics-play-pause pause"></div>' +
                    '<div id="DPics-prev" class="DPics-prev-next-btn prev-btn"></div>' +
                    '<div id="DPics-next" class="DPics-prev-next-btn next-btn"></div>' +
                    '<div class="DPics-detail">' +
                        '<span id="DPics-page" class="DPics-page"></span>' +
                        '<span id="DPics-title" class="DPics-title"></span>' +
                    '</div>' +
                    '<div id="DPics-rotate" class="DPics-rotate"</div>' +
                 '</div>';

    this.DPicsWrap.appendChild(this.DPicsItem);
    this.DPicsItem.innerHTML = strDOM;
    document.body.appendChild(this.DPicsWrap);

    function getById(id){
      return document.getElementById(id);
    }

    this.oImg = getById('DPics-img');
    this.nav = getById('DPics-nav');
    this.page = getById('DPics-page');
    this.title = getById('DPics-title');
    this.prev = getById('DPics-prev');
    this.next = getById('DPics-next');
    this.play = getById('DPicsPlay');
    this.pause = getById('DPicsPause');
    this.loading = getById('DPics-loading');
    this.rotate = getById('DPics-rotate');
    this.rotateBackFace = getById('DPics-rotate-backFace');
    this.backface = getById('DPics-back-face');

    if(!this.config.showNav){
      this.nav.style.display = 'none';
    }

    if(!this.config.switchItem){
      this.prev.style.display =
      this.next.style.display =
      this.play.style.display = 'none';
    }

    if(!this.config.autoPlay){
      this.prev.style.display = this.pause.style.display = 'none';
    }else{
      this.play.style.display = 'none';
      this.pause.style.display = 'block';
    }
  };

  window['DPicsViewer'] = DPicsViewer;

})(window,document);
