import type { APIRoute } from 'astro';

interface XPost {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  dateLabel: string;
}

const X_HANDLE = 'ectoBlogApp';
const X_FEED_URL = `https://nitter.net/${X_HANDLE}/rss`;

const decodeHtmlEntities = (value = '') =>
  value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x2F;/gi, '/');

const sanitizeText = (value = '') =>
  decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (value = '', limit = 220) => (value.length > limit ? `${value.slice(0, limit).trim()}…` : value);

const formatDateLabel = (value = '') => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const toXLink = (url = '') =>
  url
    .replace(/^https?:\/\/nitter\.net/i, 'https://twitter.com')
    .replace(/^https?:\/\/mobile\.twitter\.com/i, 'https://twitter.com');

const getTagValue = (source: string, tag: string) => {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, 'i'));
  return match ? match[1] : '';
};

const fetchLatestXPosts = async (): Promise<XPost[]> => {
  try {
    const response = await fetch(X_FEED_URL);
    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    const items = xml.split('<item>').slice(1);

    return items
      .map((item) => {
        const title = sanitizeText(getTagValue(item, 'title'));
        const description = sanitizeText(getTagValue(item, 'description'));
        const link = toXLink(sanitizeText(getTagValue(item, 'link')));
        const guid = sanitizeText(getTagValue(item, 'guid'));
        const pubDate = formatDateLabel(getTagValue(item, 'pubDate'));

        if (!link) {
          return null;
        }

        const excerpt = truncate(description || title);

        return {
          id: guid || link,
          title: title || 'Update from Ecto App',
          excerpt: excerpt || 'Stay tuned for the latest Ecto App updates.',
          link,
          dateLabel: pubDate || 'New',
        };
      })
      .filter(Boolean)
      .slice(0, 3) as XPost[];
  } catch (error) {
    console.error('Failed to fetch Latest from X feed', error);
    return [];
  }
};

export const GET: APIRoute = async () => {
  const posts = await fetchLatestXPosts();

  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
    },
  });
};
