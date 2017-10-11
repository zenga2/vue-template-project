function removeItem (item, arr) {
    let index = arr.indexOf(item)

    if (index > -1) {
        arr.splice(index, 1)
    }
}

function includes (item, arr) {
    return arr.indexOf(item) > -1
}

export { removeItem, includes }
