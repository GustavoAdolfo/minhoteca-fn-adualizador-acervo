'use strict';

function normalizeCollection(collection, label) {
  if (!Array.isArray(collection)) {
    throw new TypeError(`${label} must be an array.`);
  }

  return collection.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError(`${label}[${index}] must be an object.`);
    }

    if (item.id === undefined || item.id === null || item.id === '') {
      throw new TypeError(`${label}[${index}] must include a non-empty id.`);
    }

    return item;
  });
}

function updateAcervo(currentCollection, incomingCollection) {
  const current = normalizeCollection(currentCollection, 'currentCollection');
  const incoming = normalizeCollection(incomingCollection, 'incomingCollection');
  const incomingById = new Map(incoming.map((item) => [item.id, item]));
  const merged = current.map((item) => {
    const incomingItem = incomingById.get(item.id);

    if (!incomingItem) {
      return { ...item };
    }

    incomingById.delete(item.id);

    return { ...item, ...incomingItem };
  });

  for (const item of incomingById.values()) {
    merged.push({ ...item });
  }

  return merged;
}

module.exports = {
  updateAcervo
};
