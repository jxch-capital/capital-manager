export function svgHtmlByArr(data, width, height, color, strokeWidth) {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const xStep = width / (data.length - 1);

    let svg = `<svg width="${width}" height="${height}">`;
    svg += `<polyline points="`;

    data.forEach((value, index) => {
        const y = ((value - minValue) / (maxValue - minValue)) * height;
        const x = index * xStep;
        svg += `${x},${height - y} `;
    });

    svg += `" style="fill:none;stroke:${color};stroke-width:${strokeWidth}" />`;
    svg += '</svg>';

    return svg
}