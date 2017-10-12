function padLeft (str, padStr, totalLen) {
    while (str.length < totalLen) {
        str = padStr + str
    }

    return str.slice(-totalLen)
}

function padRight (str, padStr, totalLen) {
    while (str.length < totalLen) {
        str += padStr
    }

    return str.slice(0, totalLen)
}

// 把首字母转为大写
function firstLetterToUpperCase (str) {
    return str.replace(/^\w/, function (matchStr) {
        return matchStr.toUpperCase()
    })
}

// 将驼峰格式转为连字符格式
function camelToHyphen (str) {
    return str.replace(/[A-Z]/g, function (matchStr) {
        return '-' + matchStr.toLowerCase()
    })
}

export { padLeft, padRight, firstLetterToUpperCase, camelToHyphen }
