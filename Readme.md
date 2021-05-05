# levelatomic

This util will extend [levelup](https://github.com/Level/levelup) instance with some atomic operation methods.

## Usage

First of all, install the package from `npm`.

```bash
npm install @backrunner/levelatomic
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

`db.supdate(key: any, value: any)`

Safely update a data pair in the storage, if the key is not in the database, it will be inserted into the database.

### db.spush

`db.spush(key: any, item: any)`

Safely push an item into an `Array` (JSON serialized) in the storage. Please ensure the value to the key you pass through is an `Array`, if not, the method will throw an error.

Also, you should ensure that the `item` you passed here is a JSON safe object.

If database cannot get the stored array, this method will create one.

### db.smerge

`db.smerge(key: any, ...source: Array<object>)`

Safely merge an object with a stored object, `source` will be deep merged with the stored one.

All the `source` you passed here should be a JSON safe object, also the value to the key should be a JSON serialized string from an object.

### db.sdel

`db.sdel(key: any, cond: function)`

Safely remove an object, you can pass a function here to judge if the object has been changed, if the `cond` function returns `false`, method will throw an erro with `objChanged` property, the value of the property will be `true`.

## License

MIT
