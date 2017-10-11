// 1.引入此mixin
// 2.填写pageList
// 3.给有滚动条的元素加上名为'-save-pos-'的类,
//   如果不加，则取page的root元素

// todo 改成includePages(Array) excludePages(Array)

let posMap = {}
let elMap = {}

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let currPage = to.name
            let pageList = vm.pageList
            let elArr = elMap[currPage]
            let posArr = posMap[currPage]

            // 虽然beforeRouteLeave中已过滤，所以还是要再过滤一遍，
            // 因为它可能在下一个页面跳转的当前页的上一个页面，而不是返回当前页
            if (pageList && pageList.indexOf(from.name) > -1 && elArr) {
                elArr.forEach((el, index) => el.scrollTop = posArr[index])
            }

            elMap[currPage] = posMap[currPage] = undefined

            vm.enterPage && vm.enterPage(to, from)
        })
    },

    beforeRouteLeave (to, from, next) {
        let pageList = this.pageList
        let rootEl = this.$el
        let currPage = from.name
        let elArr

        if (pageList && pageList.indexOf(to.name) > -1) {
            elArr = Array.from(rootEl.querySelectorAll('.-save-pos-'))

            if (elArr.length === 0) {
                elArr.push(rootEl)
            }

            elMap[currPage] = elArr
            posMap[currPage] = elArr.map(el => el.scrollTop)
        }

        next()
    }
}
