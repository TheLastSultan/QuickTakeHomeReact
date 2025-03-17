import axios from 'axios';

export type SearchSource = 'stackoverflow' | 'wikipedia' | 'spotify';

export interface SearchResult {
  title: string;
  link: string;
  description?: string;
  image?: string;
}

export async function search(query: string, source: SearchSource): Promise<SearchResult[]> {
  switch (source) {
    case 'stackoverflow':
      return searchStackOverflow(query);
    case 'wikipedia':
      return searchWikipedia(query);
    case 'spotify':
      return searchSpotify(query);
    default:
      throw new Error(`Unsupported search source: ${source}`);
  }
}

async function searchStackOverflow(query: string): Promise<SearchResult[]> {
  const response = await axios.get(
    `https://api.stackexchange.com/2.3/search/advanced`,
    {
      params: {
        q: query,
        site: 'stackoverflow',
        order: 'desc',
        sort: 'relevance',
        pagesize: 10,
        filter: 'withbody'
      },
    }
  );

  return response.data.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    description: stripHtmlTags(item.body).substring(0, 200) + '...',
  }));
}

async function searchWikipedia(query: string): Promise<SearchResult[]> {
  const response = await axios.get(
    `https://en.wikipedia.org/w/api.php`,
    {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
        srlimit: 10,
      },
    }
  );

  return response.data.query.search.map((item: any) => ({
    title: item.title,
    link: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
    description: stripHtmlTags(item.snippet),
  }));
}

async function searchSpotify(query: string): Promise<SearchResult[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          title: `${query} - Top Track`,
          link: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
          description: `This is a simulated result for "${query}" on Spotify.`,
        },
        {
          title: `${query} - Popular Artist`,
          link: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
          description: 'Simulated popular artist result.',
        },
        {
          title: `${query} - Album`,
          link: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
          description: 'Simulated album result.',
        }
      ]);
    }, 800);
  });
}

function stripHtmlTags(html: string): string {
  return html ? html.replace(/<[^>]*>?/gm, '') : '';
}