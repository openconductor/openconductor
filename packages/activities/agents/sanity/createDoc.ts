import { client as sanityClient } from './client';
import { uuid } from '@sanity/uuid';
import { getDocByslug } from './getDocBySlug';

export async function createSanityDoc(doc: any) {
  //if doc find with same slug then replace

  const docSlug = doc.slug.current;
  const currentDoc = await getDocByslug({
    slug: docSlug,
  });

  let docUuid = 'drafts.' + uuid();

  if (currentDoc && currentDoc.docs[0] && currentDoc.docs[0]._id) {
    docUuid = currentDoc!.docs[0]._id;
  }

  doc._id = docUuid;

  // Create or update sanity doc

  const createdDoc = await sanityClient.createOrReplace(doc).then((res) => {
    return {
      _id: res._id,
      doc: res,
    };
  });

  console.log('createdDoc', createdDoc);

  return { createdDoc };
}
