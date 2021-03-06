export function getDocById(
  id: any,
  collection: firebase.firestore.QueryDocumentSnapshot[],
) {
  return collection.find(doc => doc.data().id === id);
}

export function getCollectionData(collection): any[] {
  if (collection) {
    return collection.docs.map(doc => doc.data());
  } else {
    return [];
  }
}

export function getNextId(collection: firebase.firestore.QuerySnapshot) {
  let maxId = 0;
  collection.docs.forEach(test => {
    if (parseInt(test.data().id) > maxId) {
      maxId = parseInt(test.data().id);
    }
  });

  return maxId + 1;
}
