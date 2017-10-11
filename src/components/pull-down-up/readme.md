1. demo
```vue
// refreshData： 下拉刷新时的刷新数据的函数(必须返回一个Promise)
// loadData：    上拉加载时的加载数据的函数(必须返回一个Promise)
<pull-down-up 
    :refreshData="refreshData"
    :loadData="loadData"
></pull-down-up>
```

2. 注意事项
```text
1) 只有scroller的高度大于wrapper时，才会启动滑动
   如果需要任何情况都可滑动，给scroller加一个min-height:101%
   pull-down-up组件 在有下拉刷新时有加
   
2) 使用pull-down-up组件的页面，改变页面后，一定要调refresh()刷新bScroll,
   例如页面初始化时调接口后
   refreshData和loadData除外，这两个组件自己会刷新
```