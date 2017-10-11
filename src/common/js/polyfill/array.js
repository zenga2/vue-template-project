if (!('includes' in Array.prototype)) {
    Object.defineProperty(Array.prototype, 'includes', {
        value (item) {
            return this.indexOf(item) > -1
        }
    })
}