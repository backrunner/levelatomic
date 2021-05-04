const locks = {};

const getFormattedKey = (key) => typeof key === 'string' ? key : JSON.stringify(key);

const delayExec = (fn, ...args) =>
  new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        resolve(fn(...args));
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
    await delayExec(key, value)
  }
};

const safePush = function (key, item) {

};

const safeMerge = function (key, obj) {

};

/**
 * @param {object} db Levelup instance
 * @returns {object} Extended levelup instance
 */
const extend = function (db) {
  db.supdate = safeUpdate;
  db.spush = safePush;
  db.smerge = safeMerge;

  return db;
};

module.exports = extend;
