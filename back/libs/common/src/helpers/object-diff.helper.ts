import { isEqualWith } from 'lodash';

export function objectDiff<T extends object>(
  oldObjInput: Partial<T>,
  newObjInput: Partial<T>,
  sortArrays: boolean = false,
): Array<keyof T> {
  const allKeys = getAllObjectKeys(oldObjInput, newObjInput);

  const changedKeys: Array<keyof T> = [];

  const [oldObj, newObj] = getSortedObjects(
    oldObjInput,
    newObjInput,
    sortArrays,
  );

  for (const key of allKeys) {
    if (!isEqualWith(oldObj[key], newObj[key])) {
      changedKeys.push(key);
    }
  }

  return changedKeys;
}

function getAllObjectKeys<T extends Record<string, unknown>>(
  objectA: T,
  objectB: T,
): Array<keyof T> {
  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);

  return [...new Set([...keysA, ...keysB])];
}

function getSortedObjects<T extends Record<string, unknown>>(
  objectA: T,
  objectB: T,
  sort: boolean,
): T[] {
  if (sort) {
    return [sortArrays({ ...objectA }), sortArrays({ ...objectB })];
  }

  return [objectA, objectB];
}

function sortArrays<T>(object: T): T {
  for (const key in object as any) {
    if (Array.isArray(object[key])) {
      object[key].sort();
    } else if (typeof object[key] === 'object') {
      sortArrays(object[key]);
    }
  }

  return object;
}
