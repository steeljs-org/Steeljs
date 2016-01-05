/**
 * 判断地址中是否有协议
 * @param  {string} url 
 * @return {boolean} 
 */
function core_hasProtocol(url) {
    return /^([a-z]+:)?\/\/\w+/i.test(url);
}