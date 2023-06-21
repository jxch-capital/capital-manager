function normalizeSegment(arr) {
    let min = Math.min(...arr.map(row => Math.min(...row)));
    let max = Math.max(...arr.map(row => Math.max(...row)));
    return arr.map(row => row.map(value => (value - min) / (max - min)));
}

function euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
}

function dtw(s, t, dist) {
    let n = s.length;
    let m = t.length;
    let DTW = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
        DTW[i] = new Array(m + 1).fill(Infinity);
    }
    DTW[0][0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            let cost = dist(s[i - 1], t[j - 1]);
            DTW[i][j] = cost + Math.min(DTW[i - 1][j], DTW[i][j - 1], DTW[i - 1][j - 1]);
        }
    }

    return DTW[n][m];
}

function calculateSimilarity(arr1, arr2) {
    let similarity = 0;
    for (let i = 0; i < arr1.length; i++) {
        let distance = 0;
        for (let j = 0; j < arr1[i].length; j++) {
            distance += Math.pow(arr1[i][j] - arr2[i][j], 2);
        }
        similarity += 1 / (1 + Math.sqrt(distance));
    }
    return similarity / arr1.length;
}

function deduplication(obj) {
    let keys = Object.keys(obj).map(Number);
    keys.sort((a, b) => a - b);

    let result = {};
    let maxKey = keys[0];
    let maxValue = obj[maxKey];
    for (let i = 1; i < keys.length; i++) {
        if (keys[i] - keys[i - 1] === 1) {
            if (obj[keys[i]] > maxValue) {
                maxKey = keys[i];
                maxValue = obj[maxKey];
            }
        } else {
            result[maxKey] = maxValue;
            maxKey = keys[i];
            maxValue = obj[maxKey];
        }
    }
    result[maxKey] = maxValue;

    return result
}

export function findSimilarSegmentsEuclidDetailsFirst(inputArr, largeArr, threshold = 0.8, windowSize = null) {
    windowSize = windowSize || inputArr.length;
    let nInputArr = normalizeSegment(inputArr);
    let similarityDict = {};
    for (let i = 0; i < largeArr.length - windowSize + 1; i++) {
        let subArr = normalizeSegment(largeArr.slice(i, i + windowSize));
        let similarity = calculateSimilarity(nInputArr, subArr);
        if (similarity > threshold) {
            similarityDict[i] = similarity;
        }
    }
    return deduplication(similarityDict);
}

export function findSimilarSegmentsDTWDetailsFirst(inputArr, largeArr, threshold = 0.1, windowSize = null) {
    windowSize = windowSize || inputArr.length;
    let nInputArr = normalizeSegment(inputArr);
    let similarityDict = {};
    for (let i = 0; i < largeArr.length - windowSize + 1; i++) {
        let subArr = normalizeSegment(largeArr.slice(i, i + windowSize));
        let similarity = dtw(nInputArr, subArr, euclideanDistance)
        similarity = 1 / (1 + similarity)
        if (similarity > threshold) {
            similarityDict[i] = similarity;
        }
    }
    return deduplication(similarityDict);
}


// 计算DTW距离
function DTWDistance(s, t) {
    let n = s.length;
    let m = t.length;
    let DTW = new Array(n + 1);
    for (let i = 0; i < n + 1; i++) {
        DTW[i] = new Array(m + 1);
        DTW[i].fill(Infinity);
    }
    DTW[0][0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            let cost = Math.abs(s[i - 1] - t[j - 1]);
            DTW[i][j] = cost + Math.min(DTW[i - 1][j], DTW[i][j - 1], DTW[i - 1][j - 1]);
        }
    }
    return DTW[n][m];
}

// 计算相似度
function DTWSimilarity(s, t) {
    return 1 / (1 + DTWDistance(s, t));
}

// 归一化函数
function DTWNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

export function findSimilarSegmentsDTWStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = DTWNormalize(openShort);
    closeShort = DTWNormalize(closeShort);
    highShort = DTWNormalize(highShort);
    lowShort = DTWNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = DTWNormalize(openLong);
        closeLong = DTWNormalize(closeLong);
        highLong = DTWNormalize(highLong);
        lowLong = DTWNormalize(lowLong);

        // 计算相似度
        let openSimilarity = DTWSimilarity(openShort, openLong);
        let closeSimilarity = DTWSimilarity(closeShort, closeLong);
        let highSimilarity = DTWSimilarity(highShort, highLong);
        let lowSimilarity = DTWSimilarity(lowShort, lowLong);

        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) /
                4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result;
}

// 计算欧几里得距离
function EuclideanDistance(s, t) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        sum += Math.pow(s[i] - t[i], 2);
    }
    return Math.sqrt(sum);
}

// 计算相似度
function euclideanSimilarity(s, t) {
    return 1 / (1 + EuclideanDistance(s, t));
}

// 归一化函数
function euclideanNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

export function findSimilarSegmentsEuclideanStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = euclideanNormalize(openShort);
    closeShort = euclideanNormalize(closeShort);
    highShort = euclideanNormalize(highShort);
    lowShort = euclideanNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = euclideanNormalize(openLong);
        closeLong = euclideanNormalize(closeLong);
        highLong = euclideanNormalize(highLong);
        lowLong = euclideanNormalize(lowLong);

        // 计算相似度
        let openSimilarity = euclideanSimilarity(openShort, openLong);
        let closeSimilarity = euclideanSimilarity(closeShort, closeLong);
        let highSimilarity = euclideanSimilarity(highShort, highLong);
        let lowSimilarity = euclideanSimilarity(lowShort, lowLong);

        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) / 4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result
}


// 计算皮尔逊相关系数
function pearsonCorrelation(s, t) {
    let sum1 = 0;
    let sum2 = 0;
    let sum1Sq = 0;
    let sum2Sq = 0;
    let pSum = 0;
    let n = s.length;

    for (let i = 0; i < n; i++) {
        sum1 += s[i];
        sum2 += t[i];
        sum1Sq += Math.pow(s[i], 2);
        sum2Sq += Math.pow(t[i], 2);
        pSum += s[i] * t[i];
    }

    let num = pSum - (sum1 * sum2) / n;
    let den = Math.sqrt(
        (sum1Sq - Math.pow(sum1, 2) / n) * (sum2Sq - Math.pow(sum2, 2) / n)
    );

    if (den === 0) return 0;

    return num / den;
}

// 计算相似度
function pccSimilarity(s, t) {
    return (pearsonCorrelation(s, t) + 1) / 2;
}

// 归一化函数
function pccNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

export function findSimilarSegmentsPCCStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = pccNormalize(openShort);
    closeShort = pccNormalize(closeShort);
    highShort = pccNormalize(highShort);
    lowShort = pccNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = pccNormalize(openLong);
        closeLong = pccNormalize(closeLong);
        highLong = pccNormalize(highLong);
        lowLong = pccNormalize(lowLong);

        // 计算相似度
        let openSimilarity = pccSimilarity(openShort, openLong);
        let closeSimilarity = pccSimilarity(closeShort, closeLong);
        let highSimilarity = pccSimilarity(highShort, highLong);
        let lowSimilarity = pccSimilarity(lowShort, lowLong);
        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) / 4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result
}


// 计算余弦相似度
function cosineSimilarity(s, t) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    for (let i = 0; i < s.length; i++) {
        dotProduct += s[i] * t[i];
        magnitude1 += Math.pow(s[i], 2);
        magnitude2 += Math.pow(t[i], 2);
    }
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
}

// 归一化函数
function cosineNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

export function findSimilarSegmentsCosineStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = cosineNormalize(openShort);
    closeShort = cosineNormalize(closeShort);
    highShort = cosineNormalize(highShort);
    lowShort = cosineNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = cosineNormalize(openLong);
        closeLong = cosineNormalize(closeLong);
        highLong = cosineNormalize(highLong);
        lowLong = cosineNormalize(lowLong);

        // 计算相似度
        let openSimilarity = cosineSimilarity(openShort, openLong);
        let closeSimilarity = cosineSimilarity(closeShort, closeLong);
        let highSimilarity = cosineSimilarity(highShort, highLong);
        let lowSimilarity = cosineSimilarity(lowShort, lowLong);

        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) / 4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result
}

// 计算曼哈顿距离
function manhattanDistance(s, t) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        sum += Math.abs(s[i] - t[i]);
    }
    return sum;
}

// 计算相似度
function manhattanSimilarity(s, t) {
    return 1 / (1 + manhattanDistance(s, t));
}

// 归一化函数
function manhattanNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

export function findSimilarSegmentsManhattanStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = manhattanNormalize(openShort);
    closeShort = manhattanNormalize(closeShort);
    highShort = manhattanNormalize(highShort);
    lowShort = manhattanNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = manhattanNormalize(openLong);
        closeLong = manhattanNormalize(closeLong);
        highLong = manhattanNormalize(highLong);
        lowLong = manhattanNormalize(lowLong);

        // 计算相似度
        let openSimilarity = manhattanSimilarity(openShort, openLong);
        let closeSimilarity = manhattanSimilarity(closeShort, closeLong);
        let highSimilarity = manhattanSimilarity(highShort, highLong);
        let lowSimilarity = manhattanSimilarity(lowShort, lowLong);

        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) / 4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result
}

// 计算斯皮尔曼等级相关系数
function spearmanRankCorrelation(s, t) {
    // 计算排名
    function rank(arr) {
        let sorted = arr.slice().sort((a, b) => a - b);
        return arr.map(v => sorted.indexOf(v) + 1);
    }

    let n = s.length;
    let rankS = rank(s);
    let rankT = rank(t);

    let dSquaredSum = 0;
    for (let i = 0; i < n; i++) {
        dSquaredSum += Math.pow(rankS[i] - rankT[i], 2);
    }

    return 1 - (6 * dSquaredSum) / (n * (Math.pow(n, 2) - 1));
}

// 计算相似度
function spearmanRankSimilarity(s, t) {
    return (spearmanRankCorrelation(s, t) + 1) / 2;
}

// 归一化函数
function spearmanRankNormalize(arr) {
    let maxVal = Math.max(...arr);
    let minVal = Math.min(...arr);
    return arr.map(x => (x - minVal) / (maxVal - minVal));
}

function findSimilarSegmentsSpearmanRankStructureFirst(shortSegment, longSegment, threshold) {
    // 将K线片段拆分为四个一维数组
    let openShort = shortSegment.map(x => x[0]);
    let closeShort = shortSegment.map(x => x[1]);
    let highShort = shortSegment.map(x => x[2]);
    let lowShort = shortSegment.map(x => x[3]);

    // 归一化
    openShort = spearmanRankNormalize(openShort);
    closeShort = spearmanRankNormalize(closeShort);
    highShort = spearmanRankNormalize(highShort);
    lowShort = spearmanRankNormalize(lowShort);

    let result = {};
    let segmentLength = shortSegment.length;

    for (let i = 0; i < longSegment.length - segmentLength + 1; i++) {
        let subSegment = longSegment.slice(i, i + segmentLength);
        let openLong = subSegment.map(x => x[0]);
        let closeLong = subSegment.map(x => x[1]);
        let highLong = subSegment.map(x => x[2]);
        let lowLong = subSegment.map(x => x[3]);

        // 归一化
        openLong = spearmanRankNormalize(openLong);
        closeLong = spearmanRankNormalize(closeLong);
        highLong = spearmanRankNormalize(highLong);
        lowLong = spearmanRankNormalize(lowLong);

        // 计算相似度
        let openSimilarity = spearmanRankSimilarity(openShort, openLong);
        let closeSimilarity = spearmanRankSimilarity(closeShort, closeLong);
        let highSimilarity = spearmanRankSimilarity(highShort, highLong);
        let lowSimilarity = spearmanRankSimilarity(lowShort, lowLong);

        if (openSimilarity > threshold && closeSimilarity > threshold && highSimilarity > threshold && lowSimilarity > threshold) {
            result[i] =
                (openSimilarity + closeSimilarity + highSimilarity + lowSimilarity) / 4;
        }
    }

    // 去除连号索引
    let keys = Object.keys(result).map(x => parseInt(x)).sort((a, b) => a - b);
    for (let i = keys.length - 1; i >= 1; i--) {
        if (keys[i] - keys[i - 1] === 1) {
            if (result[keys[i]] > result[keys[i - 1]]) {
                delete result[keys[i - 1]];
            } else {
                delete result[keys[i]];
            }
        }
    }

    return result
}



export const func = {
    findSimilarSegmentsCosineStructureFirst,
    findSimilarSegmentsManhattanStructureFirst,
    findSimilarSegmentsSpearmanRankStructureFirst,
    findSimilarSegmentsPCCStructureFirst,
    findSimilarSegmentsDTWStructureFirst,
    findSimilarSegmentsEuclideanStructureFirst,
    findSimilarSegmentsEuclidDetailsFirst,
    findSimilarSegmentsDTWDetailsFirst,
}