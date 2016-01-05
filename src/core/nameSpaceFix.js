//import ./urlFolder

/**
 * 命名空间的适应
 */
function core_nameSpaceFix(id, basePath) {
    basePath = basePath && core_urlFolder(basePath);
    if (id.indexOf('.') === 0) {
        id = basePath ? (basePath + id).replace(/\/\.\//, '/') : id.replace(/^\.\//, '');
    }
    while (id.indexOf('../') !== -1) {
        id = id.replace(/\w+\/\.\.\//, '');
    }
    return id;
}