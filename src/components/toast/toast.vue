<template>
    <div v-if="!isRemove" class="ld-toast" :class="classObj">
        <p class="toast-box">{{message}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            message: {type: String},
            onFinish: {type: Function},
            duration: {type: Number, default: 2000}
        },
        data () {
            return {
                toggleState: true,
                isRemove: false
            }
        },
        computed: {
            classObj () {
                return {
                    'ld-fade-in': this.toggleState,
                    'ld-fade-out': !this.toggleState
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.toggleState = false
                    setTimeout(() => {
                        this.isRemove = true
                        this.onFinish && this.onFinish()
                    }, 350)
                }, this.duration)
            })
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .ld-toast
        .toast-box
            z-index: 10000
            position: fixed
            top: 36%
            left: 50%
            padding: 10px 22px
            border-radius: 6px
            text-align: center
            line-height: 20px
            font-size: 15px
            transform: translateX(-50%)
            white-space: nowrap;
            color: #fff
            background: rgba(0, 0, 0, 0.8)
</style>
