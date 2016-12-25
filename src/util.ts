export function extend(dest, src = {}){
    const obj = dest || {}
    Object.keys(src).forEach(key =>{
        obj[key] = src[key]
    });
    return obj;
}

export function isFunction(obj){
    return typeof obj === 'function'
}