/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];

  newArr.sort((a, b) => {
    let elem = a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper'});
    if (param === 'asc') {elem *= 1;}
    else if (param === 'desc') {elem *= -1;}
    else {
      throw new Error(`Упс ... Направление сортировки передано: ${param}`);
    }
    return elem;
  });

  return newArr;
}
