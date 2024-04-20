import { customsearch_v1, google } from 'googleapis';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

export class GoogleSearchTool extends StructuredTool {
  name = 'google-Search';
  description = `Run a search query through the Google Custom Search API. Please format your input as an object with the following parameters:
- "query": (string) [REQUIRED] The query to search for.
- "numResults": (number) [OPTIONAL] The number of results to return.`;

  schema = z.object({
    query: z.string(),
    numResults: z.number().optional(),
  });

  customSearch?: customsearch_v1.Customsearch;
  private googleApiKey: string;
  private googleCseId: string;

  constructor({ googleApiKey, googleCseId }: { googleApiKey?: string; googleCseId?: string }) {
    super();
    this.googleApiKey = googleApiKey!;
    this.googleCseId = googleCseId!;
  }

  private getCustomSearch(): customsearch_v1.Customsearch {
    if (!this.customSearch) {
      const version = 'v1';
      this.customSearch = google.customsearch(version);
    }
    return this.customSearch;
  }

  async _call({ query, numResults }: z.infer<typeof this.schema>) {
    const response = await this.getCustomSearch().cse.list({
      q: query,
      cx: this.googleCseId,
      auth: this.googleApiKey,
    });

    if (!response.data.items || response.data.items.length === 0) {
      return 'No Google Search Result was found';
    }

    const results = response.data.items.slice(0, numResults || response.data.items.length).map((result) => {
      const metadataResult: customsearch_v1.Schema$Result = {
        title: result.title || '',
        link: result.link || '',
      };
      if (result.snippet) {
        metadataResult.snippet = result.snippet;
      }
      return metadataResult;
    });

    return JSON.stringify(results, null, 2);
  }
}
