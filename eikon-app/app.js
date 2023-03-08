// Grab user input
const inputFieldElement = document.getElementById("userInput");

const parseInput = (string) => {
  const inputData = string.split(",");
  const numericData = [];
  inputData.forEach((item) => {
    numericData.push(parseInt(item, 10));
  });
  const sortedData = numericData.sort((a, b) => a - b);
  return sortedData;
};

const makeBins = (inputArray) => {
  const binMap = new Map();
  const minElement = inputArray[0];
  const maxElement = inputArray[inputArray.length - 1];
  const rangeOfValues = maxElement - minElement;

  for (let i = minElement; i <= maxElement; i++) {
    binMap.set(i, 0);
  }

  inputArray.forEach((element) => {
    binMap.set(element, binMap.get(element) + 1);
  });

  return { binMap, rangeOfValues };
};

const drawHistogram = () => {
  const inputValue = inputFieldElement.value;
  const inputArray = parseInput(inputValue);
  const { binMap, rangeOfValues } = makeBins(inputArray);
  const values = [];
  binMap.forEach((value, key) => {
    values.push({ key, value });
  });
  drawBarChart(values, rangeOfValues);
};

const generateRandomArray = () => {
  return Array.from(
    { length: 20 },
    () => Math.floor(Math.random() * 10) - 10 / 2
  );
};

const minChartWidth = 1000;
const maxRectWidth = 50;
const minRectWidth = 5;
const svgHeight = 250;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const renderSvg = (svgHeight) => {
  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("class", "svg-container");
  const svgParent = document.getElementById("svg-parent");
  if (svgParent.childNodes[0]) {
    svgParent.removeChild(svgParent.childNodes[0]);
  }
  svgParent.appendChild(svg);
  return svg;
};

const renderRect = (svg, x, y, width, height, keyValue) => {
  const rect = document.createElementNS(SVG_NAMESPACE, "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  svg.appendChild(rect);

  // Title appears on hover
  const title = document.createElementNS(SVG_NAMESPACE, "title");
  title.innerHTML = `Freq of ${keyValue.key}: ${keyValue.value}`;
  rect.append(title);
  return rect;
};

const drawBarChart = (keyValues, rangeOfValues) => {
  const svg = renderSvg(svgHeight);

  const maxValue = keyValues.reduce((max, element) => {
    const value = element.value;
    return max > value ? max : value;
  }, 0);

  const scaleCoef = (svgHeight - 15) / maxValue; // coef larger if height bigger
  const verticalOffset = scaleCoef * maxValue;

  const minComputedRectWidth = Math.min(
    maxRectWidth,
    minChartWidth / (rangeOfValues + 1)
  );
  const xAxis = document.createElementNS(SVG_NAMESPACE, "line");
  xAxis.setAttribute("x1", `${minComputedRectWidth + 5}`);
  xAxis.setAttribute("x2", `${(rangeOfValues + 2) * minComputedRectWidth}`);
  xAxis.setAttribute("y1", "235");
  xAxis.setAttribute("y2", "235");
  xAxis.setAttribute("class", "axis");
  svg.append(xAxis);

  const yAxis = document.createElementNS(SVG_NAMESPACE, "line");
  yAxis.setAttribute("x1", `${minComputedRectWidth}`);
  yAxis.setAttribute("x2", `${minComputedRectWidth}`);
  yAxis.setAttribute("y1", "0");
  yAxis.setAttribute("y2", "235");
  yAxis.setAttribute("class", "axis");
  svg.append(yAxis);

  // y axis labels
  let i = 0;
  do {
    let adjHeight = i * scaleCoef + 10;
    const yText = document.createElementNS(SVG_NAMESPACE, "text");
    yText.innerHTML = `${i}`;
    yText.setAttribute("class", "text");
    yText.setAttribute("x", `${minComputedRectWidth / 3}`);
    yText.setAttribute("y", `${250 - adjHeight}`);
    svg.appendChild(yText);
    i += Math.round(maxValue / 4);
  } while (i < maxValue);

  keyValues.forEach((keyValue, index) => {
    const rectWidth = Math.max(minComputedRectWidth, minRectWidth);
    const rectHeight = keyValue.value * scaleCoef;
    const x = rectWidth * (index + 1);
    const y = verticalOffset - rectHeight;
    if (rangeOfValues < 10) {
      const label = document.createElementNS(SVG_NAMESPACE, "text");
      label.innerHTML = `${keyValue.key}`;
      label.setAttribute("class", "text");
      label.setAttribute("x", `${x + minRectWidth * 3}`);
      label.setAttribute("y", `${250}`);
      svg.appendChild(label);
    } else {
      if (index % 10 === 0) {
        const label = document.createElementNS(SVG_NAMESPACE, "text");
        label.innerHTML = `${keyValue.key}`;
        label.setAttribute("class", "text");
        label.setAttribute("x", `${x - rectWidth}`);
        label.setAttribute("y", `${250}`);
        svg.appendChild(label);
      }
    }
    renderRect(svg, x, y, rectWidth, rectHeight, keyValues[index]);
  });
};

const button = document.getElementById("userInputButton");
button.addEventListener("click", (e) => {
  e.preventDefault();
  drawHistogram();
});
// Generates a random array for input field
inputFieldElement.value = generateRandomArray();
// Draw a histogram from default filler data
drawHistogram();
