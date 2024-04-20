import { OAuth2Client } from 'google-auth-library';
import { webmasters_v3, google } from 'googleapis';
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

// https://developers.google.com/webmaster-tools/v1/searchanalytics/query

export class GoogleWebmastersTool extends StructuredTool {
  name = 'google-Webmasters';
  description = `Query your search traffic data with filters and parameters that you define. The method returns zero or more rows grouped by the row keys (dimensions) that you define. You must define a date range of one or more days.. Please format your input as an object with the following parameters:
- "domain": (string) [REQUIRED] The domain of the property as defined in Search Console without www. prefix.
- "startDate": (string) [REQUIRED] Start date of the requested date range, in YYYY-MM-DD format, in PT time (UTC - 7:00/8:00). Must be less than or equal to the end date.
- "endDate": (string) [REQUIRED] End date of the requested date range, in YYYY-MM-DD format, in PT time (UTC - 7:00/8:00). Must be greater than or equal to the start date.
- "numResults": (number) [OPTIONAL] The number of results to return.`;
  schema = z.object({
    domain: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    numResults: z.number().optional(),
  });

  webmasters?: webmasters_v3.Webmasters;
  private oauth2Client: OAuth2Client;

  constructor({ googleRefreshToken }: { googleRefreshToken?: string | null }) {
    super();
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    });
    this.oauth2Client.setCredentials({ refresh_token: googleRefreshToken });
  }

  private async getWebmasters(): Promise<webmasters_v3.Webmasters> {
    this.webmasters = google.webmasters({
      version: 'v3',
      auth: this.oauth2Client,
    });

    return this.webmasters;
  }

  async _call({ domain, startDate, endDate, numResults }: z.infer<typeof this.schema>) {
    const webmasters = await this.getWebmasters();

    const query = {
      siteUrl: `sc-domain:${domain}`,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 10,
      },
    };

    const response = await webmasters.searchanalytics.query(query);

    if (!response.data.rows || response.data.rows.length === 0) {
      return 'No webmasters result was found';
    }

    const results = response.data.rows.slice(0, numResults || response.data.rows.length).map((result) => {
      const metadataResult: webmasters_v3.Schema$ApiDataRow = {
        keys: result.keys || [],
        clicks: result.clicks || 0,
        ctr: result.ctr || 0,
        impressions: result.impressions || 0,
        position: result.position || 0,
      };
      return metadataResult;
    });
    return JSON.stringify(results, null, 2);
  }
}
