const onSearch = (setSearchKey) => () => {
  {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }
}
const onPreventNumberOnly = (event) => { if (!/[0-9]/.test(event.key)) event.preventDefault()}

function uniqueEntriesByObject(arr , comp) {
  // store the comparison  values in array
  const unique = arr
    .map((e) => e[comp])

    // store the indexes of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the false indexes & return unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
}

function matchedViewport({xxl, xl, lg, md, sm, xs} , valueProp  ) {

  if (xxl) return {size: valueProp.xxl}
  if (xl) return {size: valueProp.xl}
  if (lg) return {size: valueProp.lg}
  if (md) return {size: valueProp.md}
  if (sm) return {size: valueProp.sm}
  if (xs) return {size: valueProp.xs}

}

export default {
  onPreventNumberOnly,
  matchedViewport,
  uniqueEntriesByObject,
  onSearch
}