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
      switchItem: true,
      initAnimate: 'flip',
      touchSwitch: true,
      autoResize: true,
      keyControl: false,
      showDetail: false
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
    this.resizeFlag = true;

    //autoResize imageBox when resizing window
    if(this.config.autoResize){
      window.onresize = function(){
        if(_this.resizeFlag){
          _this.resizeFlag = false;
          window.clearTimeout(timer);

          timer = window.setTimeout(function(){
            if(_this.oImg){
              _this.oImg.style.opacity = 0;
              window.setTimeout(function(){
                _this.resize(_this.oImg);
              },300);
            }
          },300);
        }
      }
    }
  }

  DPicsViewer.prototype.init = function(data){
    var _this = this;
    this.imgDatas = data;
    var imgItems = this.oWrap.getElementsByTagName('li');

    for(var i = 0;i < imgItems.length;i ++){
      imgItems[i].index = i;

      imgItems[i].onclick = function(){
        var index = this.index;
        if(_this.config.initAnimate === 'flip'){
          _this.DPicsItem.className = 'DPics-item animated flipInX';
        }else if(_this.config.initAnimate === 'fadeIn'){
          _this.DPicsItem.className = 'DPics-item animated fadeIn';
        }else{
          _this.DPicsItem.className = 'DPics-item animated flipInX';
        }

        _this.DPicsDetail.style.opacity = 0;

        _this.preLoadImg(index,function(oImg){
          _this.DPicsItem.appendChild(oImg);
          _this.DPicsTitle.innerHTML = _this.imgDatas[index].title;
          _this.DPicsPage.innerHTML = index + 1 + ' / ' + _this.imgDatas.length;

          window.setTimeout(function(){
            _this.DPicsItem.style.opacity = 1;
          },480);

          window.setTimeout(function(){
            _this.resize(oImg);
          },800);

          _this.DPicsWrap.style.display = 'block';
        });
        return false;
      }
    }
  }

  DPicsViewer.prototype.preLoadImg = function(index,callback){
    var _this = this;
    this.oImg = new Image();
    this.oImg.style.opacity = 0;
    this.oImg.src = this.imgDatas[index].src;

    if(window.ActiveXObject){
      this.oImg.onreadystatechange = function(){
        if(this.readyState == "complete"){
          callback && callback(_this.oImg);
        }
      }
    }else{
      this.oImg.onload = function(){
        callback && callback(_this.oImg);
      };
    }
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

    w = scale < 1 ? Math.ceil(w * scale - 20) : Math.ceil(w * scale);
    h = scale < 1 ? Math.ceil(h * scale - 20) : Math.ceil(h * scale);
    oImg.style.width = w + 'px';
    oImg.style.height = h + 'px';
    this.DPicsItem.style.width = w + 'px';
    this.DPicsItem.style.height = h + 'px';
    this.DPicsItem.style.marginLeft = - (w + 10) / 2 + 'px';
    this.DPicsItem.style.marginTop = - (h + 10) / 2 + 'px';

    window.setTimeout(function(){
      oImg.style.opacity = 1;
      _this.resizeFlag = true;
      _this.DPicsDetail.style.opacity = 1;
    },500);
  }

  DPicsViewer.prototype.renderDOM = function(){
    this.DPicsWrap = document.createElement('div');
    this.DPicsWrap.id = this.oWrap.id + '-pop';
    this.DPicsWrap.className = 'DPicsBox';

    this.DPicsItem = document.createElement('div');
    this.DPicsItem.className = 'DPics-item';

    this.DPicsDetail = document.createElement('div');
    this.DPicsPage = document.createElement('span');
    this.DPicsTitle = document.createElement('span');

    this.DPicsDetail.className = 'detail';
    this.DPicsPage.className = 'page';
    this.DPicsTitle.className = 'title';

    this.DPicsDetail.appendChild(this.DPicsPage);
    this.DPicsDetail.appendChild(this.DPicsTitle);

    this.DPicsItem.appendChild(this.DPicsDetail);
    if(!this.config.showDetail){
      this.DPicsDetail.style.display = 'none';
    }
    this.DPicsWrap.appendChild(this.DPicsItem);
    document.body.appendChild(this.DPicsWrap);
  };

  window['DPicsViewer'] = DPicsViewer;

})(window,document);
