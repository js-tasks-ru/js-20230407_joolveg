/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const result = [];

  for (let value of new Set(arr)) {
    result.push(value);
  }
  return result;
}
