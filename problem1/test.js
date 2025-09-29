const fs = require('fs');
const path = require('path');

eval(fs.readFileSync(path.join(__dirname, 'solution.js'), 'utf8').replace(/console\.log.*$/gm, ''));

class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    run() {
        console.log('Running Test Suite for Problem 1\n');
        
        this.tests.forEach(({ name, testFn }) => {
            try {
                const result = testFn();
                if (result !== undefined) {
                    console.log(`${name} → Result: ${result}`);
                } else {
                    console.log(`${name}`);
                }
                this.passed++;
            } catch (error) {
                console.log(`${name}: ${error.message}`);
                this.failed++;
            }
        });

        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const suite = new TestSuite();

suite.test('Basic functionality: n = 5', () => {
    const result = sum_to_n_a(5);
    if (result !== 15) throw new Error(`Expected 15, got ${result}`);
    return result;
});

suite.test('Basic functionality: n = 10', () => {
    const result = sum_to_n_a(10);
    if (result !== 55) throw new Error(`Expected 55, got ${result}`);
    return result;
});

suite.test('Basic functionality: n = 1', () => {
    const result = sum_to_n_a(1);
    if (result !== 1) throw new Error(`Expected 1, got ${result}`);
    return result;
});

suite.test('Approach A vs B: n = 5', () => {
    const resultA = sum_to_n_a(5);
    const resultB = sum_to_n_b(5);
    if (resultA !== resultB) {
        throw new Error(`Approach A (${resultA}) and B (${resultB}) return different results for n = 5`);
    }
    return `A: ${resultA}, B: ${resultB}`;
});

suite.test('Approach A vs C: n = 10', () => {
    const resultA = sum_to_n_a(10);
    const resultC = sum_to_n_c(10);
    if (resultA !== resultC) {
        throw new Error(`Approach A (${resultA}) and C (${resultC}) return different results for n = 10`);
    }
    return `A: ${resultA}, C: ${resultC}`;
});

suite.test('Approach B vs C: n = 15', () => {
    const resultB = sum_to_n_b(15);
    const resultC = sum_to_n_c(15);
    if (resultB !== resultC) {
        throw new Error(`Approach B (${resultB}) and C (${resultC}) return different results for n = 15`);
    }
    return `B: ${resultB}, C: ${resultC}`;
});

suite.test('Edge case: n = 0', () => {
    const results = [sum_to_n_a(0), sum_to_n_b(0), sum_to_n_c(0)];
    if (!results.every(r => r === 0)) {
        throw new Error(`Expected all to return 0, got [${results.join(', ')}]`);
    }
    return `A: ${results[0]}, B: ${results[1]}, C: ${results[2]}`;
});

suite.test('Edge case: n = 100', () => {
    const expected = 5050;
    const results = [sum_to_n_a(100), sum_to_n_b(100), sum_to_n_c(100)];
    if (!results.every(r => r === expected)) {
        throw new Error(`Expected all to return ${expected}, got [${results.join(', ')}]`);
    }
    return `A: ${results[0]}, B: ${results[1]}, C: ${results[2]}`;
});

const success = suite.run();

if (success) {
    console.log('\nAll tests passed!');
} else {
    console.log('\nSome tests failed.');
    process.exit(1);
}
