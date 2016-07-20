# DPicsViewer
a simple pictures viewer plugin on PC and Mobile  
demo [https://davejump.github.io/DPicsViewer/]  
# usage  
### load the resources  
```
<head>
  <link rel="stylesheet" href="css/DPicsViewer.css">
</head>
<body>
  //Your imagesList layout should be like this.   
  <ul id="DPicsNormal" class="style">
    <li><img class="DPics-item" src="images/1.jpg"></li>
    <li><img class="DPics-item" src="images/2.jpg"></li>
    <li><img class="DPics-item" src="images/3.jpg"></li>
    <li><img class="DPics-item" src="images/4.jpg"></li>
  </ul>  
  //It must has an id on wrapper
  //It must has a class 'DPics-item' on each IMG element. 
  
  //And load the scripts
  <script src="js/DPicsViewer.js"></script>
  <script>
    var dpics = new DPicsViewer('DPicsNormal'[,options[object] optional]);
    //You must Initialize the data with the data parameter
    dpics.init([
      {
        src: 'images/1.jpg',
        title: 'Beautiful-1',
        desc: 'Description-1'
      },
      {
        src: 'images/2.jpg',
        title: 'Beautiful-2',
        desc: 'Description-2'
      },
      {
        src: 'images/3.jpg',
        title: 'Beautiful-3',
        desc: 'Description-3'
      },
      {
        src: 'images/4.jpg',
        title: 'Beautiful-4',
        desc: 'Description-4'
      }
    ]);
  </script>
</boby>
```  
### options  
* `loop[boolean]`  
  Loop the images. Default: false  
  
* `autoPlay[boolean]`  
  auto switch the images. Default: false  
  
* `autoPlayTime[number/ms]`  
  AutoPlay time. Default: 5000  
  
* `singleMode[boolean]`  
  If you want to see a single image instead of switching them. Default: false  
  
* `touchSwitch[boolean]`  
  If you use it in mobile or laptop,set it open and it will made you more easier to switch these images. Default: true  
  
* `autoResize[boolean]`  
  Auto resize the container to fit the window's size when you resize the window. Default: false  
  
* `keyControl[boolean]`  
  Use your keyboard arrow keys to control the switching. Default: true  
  
* `showNav[boolean]`  
  Show navigation. Default: true
