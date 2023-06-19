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

export function findSimilarSegments(inputArr, largeArr, threshold = 0.8, windowSize = null) {
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

export function findSimilarSegmentsDTW(inputArr, largeArr, threshold = 0.1, windowSize = null) {
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