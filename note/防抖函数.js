/**
spock项目 首页（公开页面）回到顶部使用防抖函数
matrix项目 onscroll  滚动到一定高度，大盘悬浮，再到一定高度，大盘消失






 --------------代码部分-----------------------
 componentDidMount(){
    this.getAllValidcomParamIds();
    this.getAllEventListBack();
    window.addEventListener('scroll',this.debounce(this.scrollEvent,300),false);
  }

 // func是用户传入需要防抖的函数
 // wait是等待时间
 // 这个防抖只能在最后调用

 debounce = (func, wait = 200) => {
      // 缓存一个定时器id
      let timer = 0
      // 这里返回的函数是每次用户实际调用的防抖函数
      // 如果已经设定过定时器了就清空上一次的定时器
      // 开始一个新的定时器，延迟执行用户传入的方法
      return function(...args) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
              func.apply(this, args)
          }, wait)
      }
  }

 scrollEvent=()=>{
      console.log('滚动条位置');
      const t = document.documentElement.scrollTop || document.body.scrollTop;//滚上去的高度
      let viewH=document.documentElement.clientHeight || document.body.clientHeight;//一屏幕的高

      const top_view = document.getElementsByClassName('back_top')[0];

      if (top_view !== null) {
          // 滚上去的高度 > 一屏幕的高度
          top_view.style.display =(t > (viewH-200) ? 'block' : 'none') ;
      }

  }


 */