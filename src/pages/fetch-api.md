---
title: Fetch API: Error Handling & Request Timeout
date: 18-Feb-2023
preview: Overview of the fetch() method, how to catch errors, and timeout the request if a website is unresponsive.
---

Fetch API provides a global `fetch()` method that allows easily fetch resources asynchronously from the web. 

The method returns a promise which is fulfilled once the response is available.

The promise resolves to the `Response` object representing the response to your request.

Basic usage:

```js
fetch(url)
  .then((response) => response.json())
  .then((data) => console.log(data));
```

`json()` is a method on the `Response` object. Returns a promise which resolves with the result of parsing the body text as JSON.  It doesn't take parameters. `data` therefore is an object containing JSON data.

Another common method is `text()` which returns a promise that resolves with a text representation of the response body.

## Error Handling:

To avoid the program from stopping due to errors, we need to add error handling. 

The Promise returned from `fetch()` will be rejected only when a network error occurs. HTTP errors like 404 or 500 will resolve normally. 

To catch them we can use an `ok` property (Boolean) on the `Response` object. It is set to `false` if the response isn't in the range 200–299.

Other errors we can catch with the `catch()` method:

```js
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    // Do something with the data object
  })
  .catch((err) => {
    console.error("Problem with fetch operation:", err);
  });
```

The same can be achieved using the `await` keyword along with `try...catch` statement:

```js
(async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    } else {
      const data = await response.json();
      //do something with the data object
    }
  } catch (err) {
    console.error("Problem with fetch operation:", err);
  }
})();
```


## Request Timeout:

In certain cases, websites may become unresponsive and in such situations, utilizing a request timeout can be quite helpful.

The easiest way to achieve that is by using the `timeout()` method on `AbortSignal` object and passing it as an argument to the `fetch()` method:

```js
{ signal: AbortSignal.timeout(5000) }
```

This method will abort the request after a specified time (in milliseconds) has elapsed, and return a `TimeoutError` error, that we can also catch:

```js
fetch(url, { signal: AbortSignal.timeout(5000) })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    // Do something with the data object
  })
  .catch((err) => {
    if (err.name === "TimeoutError") {
      console.error("The request was timed out.");
    } else {
      console.error(`Error: type: ${err.name}, message: ${err.message}`);
    }
  });
```

And again, the same thing using the `await` keyword:

```js
(async () => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    } else {
      const data = await response.json();
      //do something with the data object
    }
  } catch (err) {
    if (err.name === "TimeoutError")
      console.error("The request was timed out.");
    else 
      console.error(`Error: type: ${err.name}, message: ${err.message}`);
  }
})();
```


Happy fetching! 
