/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');

  return function (propObj) {
    let result = {...propObj};
    props.forEach((item) => {
      if (result === undefined) {return;}
      result = result ? result[item] : result;
    });
    return result;
  };
}
