<template>
    <div ref="wrapper">
        <slot name="scroller"></slot>
        <div v-if="!!refreshData" ref="topBox" class="top-tip-box">
            <span :class="topIconClass"></span>
            <p>{{topTipText}}</p>
        </div>
        <slot name="other"></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'

    const topHeight = 66
    const constMap = {
        // 信息已全部加载完成的提示语
        loadedAllDataTip: '没有更多了',
        // 信息正在加载中的提示语
        loadingTip: '正在加载中...',
        // 顶部框还未全部下拉出来的提示语
        beforeRefreshTip: '下拉刷新',
        // 顶部框已经全部下拉出来的提示语
        startRefreshTip: '释放刷新',
        // 正在刷新的提示语
        refreshingTip: '刷新中，请稍等...',
        // 刷新成功的提示语
        refreshedTip: '刷新成功'
    }

    export default {
        props: {
            // 需要返回一个Promise对象
            refreshData: {type: Function},
            // 需要返回一个Promise对象
            loadData: {type: Function}
        },
        data () {
            return {
                bScroll: undefined,
                topIconClass: 'pull_down',
                topTipText: '下拉刷新',
                isLoading: false
            }
        },
        methods: {
            initEvent () {
                let bScroll = this.bScroll

                bScroll.on('scroll', ({y}) => {
                    this.moveIn(y)
                })

                // 只在有下拉刷新时才需要
                if (this.refreshData) {
                    bScroll.on('touchEnd', ({y}) => {
                        if (y > topHeight) {
                            // stop只有在过渡正在进行时才能起作用，所以延迟一下
                            setTimeout(() => {
                                bScroll.disable()
                                bScroll.stop()
                                bScroll._translate(0, topHeight)

                                this.onRefreshData()
                            }, 0)
                        }
                    })
                }

                bScroll.on('beforeScrollStart', () => {
                    this.blurInputBox()
                })
            },

            moveIn (y) {
                let topBox = this.$refs.topBox
                let top

                // 避免多次调用加载数据的方法
                if (this.isLoading) return

                // 只在有下拉刷新时才需要
                if (this.refreshData && y > 0) {
                    top = Math.min(y, topHeight)
                    topBox.style.top = -topHeight + top + 'px'
                }

                if (y <= this.bScroll.maxScrollY) {
                    // 只在有上拉加载时才需要
                    if (!this.loadData) return

                    this.onLoadData()
                } else if (y < 0) {
                    // in center
                } else if (y < topHeight) {
                    // 只在有下拉刷新时才需要
                    if (!this.refreshData) return

                    this.refreshTopBox('pull_down', constMap.beforeRefreshTip)
                } else {
                    // 只在有下拉刷新时才需要
                    if (!this.refreshData) return

                    this.refreshTopBox('pull_down', constMap.startRefreshTip)
                }
            },

            refreshTopBox (className, tip) {
                if (className) {
                    this.topIconClass = className
                }

                if (tip) {
                    this.topTipText = tip
                }
            },

            onRefreshData () {
                let refreshData = this.refreshData

                this.refreshTopBox('pull_load', constMap.refreshingTip)

                if (refreshData) {
                    refreshData().then(
                        // 刷新成功
                        () => {
                            this.refreshTopBox('pull_success', constMap.refreshedTip)
                            // 让刷新成功的效果展示350ms
                            setTimeout(() => this.afterRefreshData(), 350)
                        },
                        // 刷新失败
                        () => this.afterRefreshData()
                    )
                }
            },

            afterRefreshData () {
                let bScroll = this.bScroll

                bScroll.refresh()
                bScroll.enable()
                bScroll.scrollTo(0, 0, 350)

                setTimeout(() => {
                    this.moveIn(0)
                }, 350)
            },

            onLoadData () {
                let bScroll = this.bScroll
                let loadData = this.loadData

                this.isLoading = true

                bScroll.disable()
                bScroll.stop()

                if (loadData) {
                    loadData().then(
                        // 加载数据成功
                        () => this.$nextTick(this.afterLoadData),
                        // 加载数据失败
                        () => this.afterLoadData()
                    )
                }
            },

            afterLoadData () {
                let bScroll = this.bScroll

                bScroll.refresh()
                bScroll.enable()

                this.isLoading = false
            },

            // 当点击其他区域时，使input blur
            blurInputBox () {
                let inputList = this.$refs.wrapper.querySelectorAll('.-text-input-')
                Array.from(inputList).forEach(item => {
                    item.blur()
                })
            },

            refresh () {
                this.bScroll.refresh()
            }
        },
        mounted () {
            let wrapper = this.$refs.wrapper

            // 当有下拉刷新时，使其可滑动
            if (this.refreshData) {
                wrapper.firstElementChild.style.minHeight = '101%'
            }

            this.$nextTick(() => {
                setTimeout(() => {
                    this.bScroll = new BScroll(wrapper, {
                        probeType: 3,
                        tap: true
                    })

                    this.initEvent()
                }, 100)
            })
        },
        beforeDestroy () {
            if (this.bScroll) {
                this.bScroll.destroy()
                delete this.bScroll
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .top-tip-box
        z-index: -1
        position: absolute
        left: 0
        top: -66px
        right: 0
        padding: 15px 0 5px
        width: 100%
        height: 66px
        text-align: center

    .top-tip-box > span
        display: inline-block
        width: 24px
        height: 24px
        line-height: 0
        background: url(./images/down.gif) no-repeat center
        background-size: cover

    .top-tip-box > p
        padding-top: 8px
        height: 18px
        line-height: 10px
        font-size: 10px
        color: #c8c8c8

    .top-tip-box > span.pull_down
        background: url(./images/down.gif) no-repeat center center
        background-size: cover

    .top-tip-box > span.pull_load
        background: url(./images/refresh.gif) no-repeat center center
        background-size: cover

    .top-tip-box > span.pull_success
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARRSURBVGhD3VqxktMwEE1FS09JRU1DwQfwAQzVNTQXH0N/M1S5Nv19BTNXpLLDzfABXOw0R0l5Dd21NLBvtQqJtLJlW7ZzeTM7ia3Vap+llVayZ6kxv908vyjK9/OiWmZFdZMV5T3J7yyv/tD1X/NL13SfdFbQY32qJyaOD5+/lS+yvLycF2XFJDoK1yc7sCemp8X5+u4NemHXO6mE7MEu7EtT42JebF7Rk16rzqUWagftSdPD4sPX+2ccW6l7rElMjy7RvriSHtxrPGEoDjhCsfSTfq+zfPsxW2/fIqbsJIJfjlm6z+WkJ/qqrUPBxDRAb17km3f0BB/1Ro3M8+oX6Sw+3f54KdVaAfVQH3Y0+1bgB/yRav2RFduzuiHJDlFPpBo+sAN7tUTZn+2ZVOkOJqc1AEEjeXk1VFxIvC/q470HSQyDkHE83fP87rWoDgq0E+xN8q/TcJV40GMuL7+PnXWgPbSr+QM/W8W9GRp6RkLGVkMNySbIkF3pfpVVtF9kBDmkZwRPcCpyFmi/pieXohaGyVD8uEMMHEsyDD/UmCS/G9dIejp++kUVx5pQYgF/1AmQ/BcVH0hsvQqm0pWoHBXgl+ZvMEHXAhhDYeq4C4EnHWWogoeo/Afnho6ikQTZwoAIJSLefpK6+9JVoqfzcKy9ZxHqRfARFQN13curL1I8OXZHILQDkVs7wE/Xd/CR4vDw7LorSA0ittj5pSwF8HPfbyu7ZQ1Pxyuk/RkXTowDcjvx5wX46+qBlxSqmcs1F04IjRzde/QmEAL8VXRNZkMXN24h9mNcOBFC5EJrnJwMuPpmuVCPIZRgHgttyQF8/OHUAS9TyIewh4XaMBgDXcgB2kSJZY4LtZwulFjjSVGDfBItt5KhKzmA94tKXS50CyBc4MDdacAhKeqNPuQs3PoQUxDZg1palIJkCnINPRgXg7iHSq5uH5IpyAH1MdhiFkXDqUimIgc0zKLt1sEUJFOSA2rXQfrTOpPpQxI6Sr3O5ACyEc5kuuaiXUgOQQ6ozUW1AIXE7CbakByKXONuAsD+yVOK3A/GkByKHAA/fdt7+0EgsKOPPo+pIzkkuegdfWiYtjmTCZF0JRU5IPpMBqCGe5+qNZFMSS7Ue+AhKodAw64yS8tz0RDJlOQAsucNfUhtG0Qmyck2J+aUQICUkKX/6V49dzrZBtwdgxUMhdAWamzAD31iiXg3AdATP923SwAHr7YuGiNP//0ggOxAYsczhic49nDl/V6459q94bU46Xf0FqGFlAXkn/JXFhZMsqYRfrq0H0tFFHZgL9hrEPYn4ZsvDINgTIrAITzxTvFAkLgf/0snC7N4t/9WDZkFn+fIxIRfXHPmZHbi03+rZiFxcZpfG+7DpErjfS861oztQRJrdfHtK7CbMjnvBd5P0iYzlAHFCtcnO+p+7liASQQHPhyr8tU9zYwPdM2zMH7NNU0sNPygx/ojZ0cngtnsH9yCrS7LO/vgAAAAAElFTkSuQmCC") no-repeat center center
        background-size: cover
</style>
