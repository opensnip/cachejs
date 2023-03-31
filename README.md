## Cachejs

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

Cachejs is a fast and lightweight caching library for javascript.

## Features

- Super Fast
- Lightweight
- Multiple cache eviction policy (FIFO, LIFO, LRU, MRU)
- TTL support
- Custom cache-miss value

## Installation

Install using npm:

```console
$ npm i @opensnip/cachejs
```

Install using yarn:

```console
$ yarn add @opensnip/cachejs
```

## Example

A simple cachejs cache example:

```js
const Cache = require("@opensnip/cachejs");

// Create cache object
const cache = new Cache();

// Add data in cache
cache.set("a", 10);

// Check data exists in cache
cache.has("a"); // true

// Get data from cache
console.log(cache.get("a")); // 10

// Get all data from cache
cache.forEach(function (data) {
  console.log(data); // { a: 10 }
});

// Get all data to array
console.log(cache.toArray()); // [ { a: 10 } ]

// Delete data from cache
cache.delete("a");

// Delete all data from cache
cache.clear();
```

## Create a new cache

To create a new cache we need to create a new instance of cachejs. While creating a new cache we can set the configuration like eviction policy, cache max length and ttl, but it is not mandatory and if we not set any configuration then the default values are used.

Defination:

```js
const cache = new Cache(options);
```

Where options are the following:

- `evictionPolicy` : eviction policy is can be any valid cache eviction policy, supported eviction policy are FIFO, LIFO, LRU, MRU
- `maxLength` : max length is a cache max length, max length is a positive integer value. The default value is 250, if the value is 0 then it will not check the max length.
- `ttl` : is cache expires time in milliseconds, the default value is 0 and if value if 0 it will not check the ttl.
- `interval` : interval is the time interval in milliseconds, after every interval all the expired items are automatically removed. Default value is 60000 and if value is 0 then it will not removes expired items automatically, but don't worry expired items are treated as missing, and deleted when they are fetched.
- `enableInterval` : enableInterval is a boolean value that is used to enable and disable the interval, the default value is false and if value is explicitly set to false then it will not run the interval even if the interval time is set.

Cachejs support TTL, but it is not a TTL cache, and also does not make strong TTL guarantees. When ttl interval is set, expired items are removed from cache periodically.

Example:

```js
const Cache = require("@opensnip/cachejs");

// Create cache object
const cache = new Cache({
  evictionPolicy: "LRU",
  maxLength: 10,
  ttl: 100,
  interval: 60000,
});
```

## Set a new data

In cachejs any value (both objects and primitive values) may be used as either a key or a value, duplicate keys not allowed and if duplicate item is inserted it will be replaced by the new item.

```js
// Add new data in cache
cache.set("a", 10);

// Add new data in cache
cache.set("user", { name: "abc" });

// Add duplicate data
cache.set("a", 20); // Replace the old value
```

## Set ttl for single data

By default the configuration TTL value is used for every item, but we can set TTL for a single item.

```js
// Add new data in cache
cache.set("b", 10, { ttl: 200 }); // Expires after 200 ms
```

## Get data from cache

By default on cache miss cachejs returns undefined value, but undefined also can be used as a value for item. In this case you can return a custom value on cache miss.

```js
// Add new data in cache
cache.set("a", 10);

// Get data
cache.get("a"); // 10
```

Customize cache miss value:

```js
// Add new data in cache
cache.set("a", undefined);

cache.get("a"); // undefined
cache.get("b"); // undefined

// Set custom return value
cache.get("a", function (err, value) {
  if (err) return null;
  return value;
}); // undefined

cache.get("b", function (err, value) {
  if (err) return null;
  return value;
}); // null
```

## Check data exists in cache

Check weather item exists in the cache or not.

```js
// Add new data in cache
cache.set("a", undefined);

// Check data exists or not
cache.has("a"); // true
cache.has("b"); // false
```

## Delete data from cache

Remove data from cache.

```js
// Delete data
cache.delete("a");
```

## Delete all data from cache

Remove all data from the cache.

```js
// Delete all data
cache.clear();
```

## Get all data from cache

Get all data from the cache.

```js
// Add new data in cache
cache.set("a", 10);

// Get all data
cache.forEach(function (data) {
  console.log(data); // { a: 10 }
});

// OR

for (let data of cache) {
  console.log(data); // { a: 10 }
}
```

## Get data as array

```js
// Add new data in cache
cache.set("a", 10);

// Get all data
console.log(cache.toArray()); // [ { a: 10 } ]
```

## License

[MIT License](https://github.com/opensnip/cachejs/blob/main/LICENSE)

[npm-downloads-image]: https://badgen.net/npm/dm/@opensnip/cachejs
[npm-downloads-url]: https://npmcharts.com/compare/@opensnip/cachejs?minimal=true
[npm-install-size-image]: https://badgen.net/packagephobia/install/@opensnip/cachejs
[npm-install-size-url]: https://packagephobia.com/result?p=@opensnip/cachejs
[npm-url]: https://npmjs.org/package/@opensnip/cachejs
[npm-version-image]: https://badgen.net/npm/v/@opensnip/cachejs
