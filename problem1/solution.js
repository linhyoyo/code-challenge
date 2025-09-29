// Problem 1: Three ways to sum to n
// Implement three unique approaches to calculate the sum of integers from 1 to n

// Approach A: Iterative loop
// Uses a for loop to accumulate the sum
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Approach B: Recursive
// Uses recursion to build up the sum
var sum_to_n_b = function(n) {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_b(n - 1);
};

// Approach C: Mathematical formula
// Uses the formula: n * (n + 1) / 2
var sum_to_n_c = function(n) {
    return n * (n + 1) / 2;
};