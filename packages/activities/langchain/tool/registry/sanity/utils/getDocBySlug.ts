import { client as sanityClient } from './createClient';

export async function getDocByslug(requestBody: any) {
  // Get product
  if (requestBody.slug) {
    const query = `*[_type == "doc" && slug.current == "` + requestBody.slug + `"]`;
    const docs = await sanityClient.fetch(query);

    return { docs };
  }
}
