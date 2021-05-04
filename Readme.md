# levelatomic

This util will extend [levelup](https://github.com/Level/levelup) instance with some atomic operation methods.

## Usage

First of all, install the package from `npm`.

```bash
npm install levelatomic
```

Then wrap your levelup instance like this:

```js
const levelatomic = require('levelatomic');
const levelup = require('levelup');
const leveldown = require('leveldown');

const db = levelatomic(levelup(leveldown(STORAGE_PATH)));
```

## API Reference

In the extended methods, `key` will also be the key for locks, if `key` is not a string, we will use `JSON.stringify` to serialize the key.

All extended methods only support `Promise`, please use `Promise` to organize your application, not callbacks.

### db.supdate

db.supdate(key: any, value: any)

Safely update a data pair in the storage.

### db.spush

db.spush(key: any, item: any)

Safely push an item into an `Array` (JSON serialized) in the storage. Please ensure the value to the key you pass through is an `Array`, if not, the method will throw an error.

Also, you should ensure that the `item` you passed here is a JSON safe object.

### db.smerge

db.smerge(key: any, obj: object)

Safely merge an object with a stored object, the `obj` will be deep merged with the stored one.

The `obj` you passed here should be a JSON safe object, also the value to the key should be a JSON serialized string from an object.

## License

MIT
