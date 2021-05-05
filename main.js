const locks = {};

const getFormattedKey = (key) => typeof key === 'string' ? key : JSON.stringify(key);

const delayExec = (fn, thisArg, ...args) =>
  new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        resolve(fn.call(thisArg, ...args));
      } catch (err) {
        reject(err);
      }
    });
  });

const lock = (key) => {
  const formattedKey = getFormattedKey(key);
  const ret = locks[formattedKey];
  locks[formattedKey] = true;
  return ret;
};

const unlock = (key) => {
  delete locks[getFormattedKey(key)];
};

const safeUpdate = function (key, value) {
  if (lock(key)) {
    await delayExec(safeUpdate, this, key, value);
  }
  try {
    await this.put(key, value);
  } catch (err) {
    unlock(key);
    throw err;
  }
  unlock(key);
};

const safeDel = function (key, cond) {
  if (lock(key)) {
    return await delayExec(safeDel, this, key, cond);
  }
  const obj = await this.get(key);
  if (typeof cond === 'function') {
    if (!cond(obj)) {
      unlock(key);
      const err = new Error('Object changed.');
      err.objChanged = true;
      throw err;
    }
  }
  try {
    await this.del(key);
  } catch (err) {
    unlock(key);
    throw(err);
  }
  unlock(key);
}

const safeMerge = function (key, ...source) {
  if (lock(key)) {
    return await delayExec(safeMerge, this, key, ...source);
  }
  try {
    const stored = await this.get(key);
    let merged = stored ? JSON.parse(stored) : {};
    source.forEach((obj) => {
      merged = merge(merged, obj);
    });
    await this.put(key, JSON.stringify(merged));
  } catch (err) {
    unlock(key);
    throw err;
  }
  unlock(key);
};

const safePush = function (key, item) {
  if (lock(key)) {
    return await delayExec(safePush, this, key, item);
  }
  try {
    const stored = await this.get(key);
    let list = stored ? JSON.parse(stored) : null;
    if (!list || !Array.isArray(list)) {
      list = [];
    }
    list.push(value);
    await this.put(key, JSON.stringify(list));
  } catch (err) {
    unlock(key);
    throw err;
  }
  unlock(key);
};

/**
 * @param {object} db Levelup instance
 * @returns {object} Extended levelup instance
 */
const extend = function (db) {
  db.supdate = safeUpdate;
  db.sdel = safeDel;
  db.spush = safePush;
  db.smerge = safeMerge;

  return db;
};

module.exports = extend;
