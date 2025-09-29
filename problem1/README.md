# Problem 1: Three Ways to Sum to n

## Problem Statement
Implement 3 unique approaches to calculate the sum of integers from 1 to n in JavaScript.

**Input:** `n` - any integer (assuming result will be less than `Number.MAX_SAFE_INTEGER`)  
**Output:** Sum of integers from 1 to n  
**Example:** `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`

## Solutions

### Approach A: Iterative Loop
```javascript
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};
```

### Approach B: Recursive Approach
```javascript
var sum_to_n_b = function(n) {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_b(n - 1);
};
```

### Approach C: Mathematical Formula
```javascript
var sum_to_n_c = function(n) {
    return n * (n + 1) / 2;
};
```

## Testing

### Running the Solutions

#### Console Testing
```bash
node solution.js
```

#### Browser Testing
Open `demo.html` in a web browser for interactive testing.

#### Unit Testing
```bash
node test.js
```

## Files Structure

```
problem1/
├── solution.js      # Implementation file
├── test.js          # Unit tests
├── demo.html        # Demo
└── README.md        # Documentation
```
