---
title: First Hacker Article
author: Patrick P
date: 15-Feb-2023
preview: This is my first blog post
---

## Type conversion

String to number: Test 1

```js
let amount = "100";

amount = parseInt(amount);
amount = +amount;
amount = Number(amount);
```

Number to string:

```js
let amount = 100;
amount = amount.toString();
amount = String(amount);
```

number is primitive, but it has a method on it. IT's because JS creates a temporary wrapper on primitive data.

## Operators

Increment:

```js
x = x + 1;
x++;
```

Assignment operators:

```js
x = x + 5;
x += 5;
```

Comparison:

- evaluates value (skips type)
  - 2 == '2' → true
  - !=
- evaluates value & type:
  - 2 === '2' → false
  - !==

==Most cases use triple equals \=\=\= ==

## Type Coercion

```js
let x;
x = 5 + "5";
```

## Working with Strings

### Template literals:

```js
x = `My name is ${firstName}`;
```

String Properties and Methods

- Properties:
  - e.g. `.length`
- Methods
  - e.g. `.toUpperCase()`
  - .IndexOf('d')
  - .substring(2,7)
  - .chatAt(0)
  - **.trim() - trims white space**
  - .replace('World', 'John')
  - .includes('hell') - true / false
  - **.split(' ') - splits a string into an array, and takes a separator as argument**

Access prototype to see methods available

```js
x = firstName.__proto__;
```
