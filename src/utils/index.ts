import { DataTableColumn, TreeSelectOption } from 'naive-ui'
import { TablePropsType } from '@/types/components'

export function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function uuid() {
    const s: Array<any> = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
}

export function randomString(length: number) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
    }
    return result
}

/**
 * 中划线字符驼峰
 * @param {*} str 要转换的字符串
 * @returns 返回值
 */
export function toHump(str: string): string {
    if (!str) return str
    return str
        .replace(/\-(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
        .replace(/(\s|^)[a-z]/g, function (char) {
            return char.toUpperCase()
        })
}

export function sortColumns(originColumns: DataTableColumn[], newColumns: TablePropsType[]) {
    if (!originColumns || !newColumns) {
        return
    }
    if (newColumns.length === 0) {
        originColumns.length = 0
    } else {
        const selectionItem = originColumns.find((it) => it.type === 'selection')
        originColumns.length = 0
        if (selectionItem) {
            originColumns.push(selectionItem)
        }
        originColumns.push(...newColumns)
    }
}

export function transformTreeSelect(
    origin: any[],
    labelName: string,
    keyName: string
): TreeSelectOption[] {
    const tempSelections: TreeSelectOption[] = []
    origin.forEach((it) => {
        const selection = {
            label: it[labelName],
            key: it[keyName],
        } as TreeSelectOption
        if (it.children) {
            selection.children = transformTreeSelect(it.children, labelName, keyName)
        }
        tempSelections.push(selection)
    })
    return tempSelections
}

// 定义一个深拷贝函数  接收目标target参数
function deepClone(target: any): any {
    // 定义一个变量
    let result:any;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if(target===null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if(target.constructor===RegExp){
            result = target;
        }else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
    // 返回最终结果
    return result;
}

export { deepClone }