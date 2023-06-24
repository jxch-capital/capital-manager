export const type = {
    singleK: "singleK"
}

export function baldK(kLine, thresholdRatio = 0.0001) {
    return {
        "index": "baldK",
        "type": type.singleK,
        "data": kLine.reduce((indexes, candle, index) => {
            const threshold = Math.max(candle.open, candle.close) * thresholdRatio;
            if (Math.abs(candle.high - Math.max(candle.open, candle.close)) <= threshold || Math.abs(Math.min(candle.open, candle.close)) - candle.low <= threshold) {
                indexes.push(index);
            }
            return indexes;
        }, []),
    }
}


export const func = {
    baldK,
}

