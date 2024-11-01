const fs = require('fs');

function parseJSON(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing JSON file: ${error}`);
        process.exit(1);
    }
}

function decodeValue(base, value) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points, atX = 0) {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
        const { x: xi, y: yi } = points[i];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const { x: xj } = points[j];
                term *= (atX - xj) / (xi - xj);
            }
        }

        result += term;
    }

    return Math.round(result);
}

function findConstantTerm(input) {
    const { n, k } = input.keys;
    const points = [];

    for (let i = 1; i <= n; i++) {
        const key = i.toString();
        const point = input[key];
        
        // Log each key and point to ensure it's correctly accessed
        console.log(`Processing key: ${key}, point:`, point);

        if (!point) {
            console.error(`Error: Point with key '${key}' is missing in the JSON input.`);
            continue; // Skip this point if it's missing
        }

        const { base, value } = point;
        const x = parseInt(key);
        const y = decodeValue(base, value);
        points.push({ x, y });
    }

    const requiredPoints = points.slice(0, k);

    // Get the constant term (f(0)) using Lagrange interpolation
    return lagrangeInterpolation(requiredPoints, 0);
}

// Read test cases
const input1 = parseJSON('testcase1.json');
const input2 = parseJSON('testcase2.json');

// Solve for both test cases
console.log("Input 1 Structure:", input1);
console.log("Input 2 Structure:", input2);

const constant1 = findConstantTerm(input1);
const constant2 = findConstantTerm(input2);

// Output the results
console.log(`Secret for testcase 1: ${constant1}`);
console.log(`Secret for testcase 2: ${constant2}`);
