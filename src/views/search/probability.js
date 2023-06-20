export function calculateProbability(inputObjArr, expression) {
    // 解析表达式
    let match = expression.match(/^P\((.*)\)$/);
    if (!match) {
        throw new Error('无效的表达式');
    }
    let conditions = match[1].split(/\s*\|\s*/);
    let mainConditions = conditions[0].split(/\s*,\s*/);
    let givenConditions = conditions.slice(1).flatMap(condition => condition.split(/\s*,\s*/));

    // 解析条件
    function parseCondition(condition) {
        let match = condition.match(/^([a-zA-Z]+)\s*([<>])\s*([\d.-]+)$/);
        if (!match) {
            throw new Error('无效的条件');
        }
        return {
            dimension: match[1],
            operator: match[2],
            threshold: parseFloat(match[3])
        };
    }

    let mainConditionsParsed = mainConditions.map(parseCondition);
    let givenConditionsParsed = givenConditions.map(parseCondition);

    // 计算概率
    let givenCount = inputObjArr.filter(point => givenConditionsParsed.every(condition => condition.operator === '>' ? point[condition.dimension] > condition.threshold : point[condition.dimension] < condition.threshold)).length;
    if (givenCount === 0) {
        return 0;
    }
    let count = inputObjArr.filter(point => mainConditionsParsed.every(condition => condition.operator === '>' ? point[condition.dimension] > condition.threshold : point[condition.dimension] < condition.threshold) && givenConditionsParsed.every(condition => condition.operator === '>' ? point[condition.dimension] > condition.threshold : point[condition.dimension] < condition.threshold)).length;
    return count / givenCount;
}

