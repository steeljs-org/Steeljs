/**
 * 两点之间的距离
 */

function core_math_distance(point1, point2) {
    return Math.sqrt(Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2));
}
