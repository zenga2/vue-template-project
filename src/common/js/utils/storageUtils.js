const defaultModule = 'ld'
const storageKey = 'ldPraviteStorage'

export default class StorageUtil {
    constructor (storageType) {
        this.storage = window[storageType]
        this.isSupport(storageType)
    }

    isSupport (storageType) {
        try {
            this.storage.setItem('test', 'test web storage')
            this.storage.removeItem('test')
        } catch (e) {
            throw new Error('Your browser does not support ' + storageType)
        }
    }

    setItem (key, val, module = defaultModule) {
        let itemKey = this.getItemKey(key, module)
        this.storage.setItem(itemKey, JSON.stringify({value: val}))
    }

    getItem (key, module = defaultModule) {
        let itemKey = this.getItemKey(key, module)
        let data = this.storage.getItem(itemKey)

        if (data === null) {
            return data
        } else {
            data = JSON.parse(data)
            return data.value
        }
    }

    removeItem (key, module = defaultModule) {
        let itemKey = this.getItemKey(key, module)
        this.storage.removeItem(itemKey)
    }

    getItemKey (key, module) {
        return storageKey + '_' + module + '|' + key
    }

    clear (module = defaultModule) {
        let len = this.storage.length

        for (let i = 0; i < len; i++) {
            let itemKey = this.storage.key(i)
            let arr = itemKey.split('|')[0].split('_')

            if (module === arr[1]) {
                this.storage.removeItem(itemKey)
            }
        }
    }
}
