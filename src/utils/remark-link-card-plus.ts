import type { Html, Link, Root, Text } from "mdast";
import sanitizeHtml from "sanitize-html";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type OgData = {
  title: string;
  description: string;
  faviconUrl?: string | undefined;
  imageUrl?: string | undefined;
};

type Options = {
  shortenUrl?: boolean;
  thumbnailPosition?: "right" | "left";
  noThumbnail?: boolean;
  noFavicon?: boolean;
  ogTransformer?: (og: OgData, url: URL) => OgData;
  ignoreExtensions?: string[];
};

type LinkCardData = {
  title: string;
  description: string;
  faviconUrl: string;
  ogImageUrl?: string;
  displayUrl: string;
  url: URL;
};

type OgResult = {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  favicon?: string;
};

const defaultOptions: Options = {
  shortenUrl: true,
  thumbnailPosition: "right",
  noThumbnail: false,
  noFavicon: false,
  ignoreExtensions: [],
};

const remarkLinkCard: Plugin<[Options], Root> =
  (userOptions: Options) => async (tree) => {
    const options = { ...defaultOptions, ...userOptions };
    const transformers: (() => Promise<void>)[] = [];

    const shouldIgnoreUrl = (url: string): boolean => {
      if (!options.ignoreExtensions?.length) return false;
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname.toLowerCase();
        return options.ignoreExtensions.some((ext) =>
          pathname.endsWith(ext.toLowerCase()),
        );
      } catch {
        return false;
      }
    };

    const addTransformer = (url: string, index: number) => {
      transformers.push(async () => {
        const data = await getLinkCardData(new URL(url), options);
        const linkCardNode = createLinkCardNode(data, options);
        if (index !== undefined) {
          tree.children.splice(index, 1, linkCardNode);
        }
      });
    };

    const isValidUrl = (value: string): boolean => {
      if (!URL.canParse(value)) return false;

      const basicUrlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
      if (!basicUrlPattern.test(value)) return false;

      return true;
    };

    visit(tree, "paragraph", (paragraph, index, parent) => {
      if (parent?.type !== "root" || paragraph.children.length !== 1) return;

      let unmatchedLink: Link | undefined;
      let processedUrl: string | undefined;

      visit(paragraph, "link", (linkNode) => {
        const firstChild = linkNode.children[0];
        const hasOneChildText =
          linkNode.children.length === 1 && firstChild?.type === "text";
        if (!hasOneChildText) return;

        const childText = firstChild as Text;
        if (!isSameUrlValue(linkNode.url, childText.value)) {
          unmatchedLink = linkNode;
          return;
        }

        if (index !== undefined) {
          processedUrl = linkNode.url;
          if (!shouldIgnoreUrl(linkNode.url)) {
            addTransformer(linkNode.url, index);
          }
        }
      });

      visit(paragraph, "text", (textNode) => {
        if (!isValidUrl(textNode.value)) return;
        if (processedUrl === textNode.value) return;

        // NOTE: Skip card conversion if the link text and URL are different, e.g., [https://example.com](https://example.org)
        if (
          unmatchedLink &&
          textNode.value === (unmatchedLink.children[0] as Text).value &&
          textNode.position?.start.line === unmatchedLink.position?.start.line
        ) {
          return;
        }

        if (index !== undefined) {
          if (!shouldIgnoreUrl(textNode.value)) {
            addTransformer(textNode.value, index);
          }
        }
      });
    });

    try {
      await Promise.all(transformers.map((t) => t()));
    } catch (error) {
      console.error(`[remark-link-card-plus] Error: ${error}`);
    }

    return tree;
  };

const isSameUrlValue = (a: string, b: string) => {
  try {
    return new URL(a).toString() === new URL(b).toString();
  } catch {
    return false;
  }
};

const parseOgTags = (html: string): OgResult => {
  const result: OgResult = {};

  // Extract og:title
  const titleMatch = html.match(
    /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  if (titleMatch?.[1]) {
    result.ogTitle = decodeHtmlEntities(titleMatch[1]);
  } else {
    const titleMatch2 = html.match(
      /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i,
    );
    if (titleMatch2?.[1]) {
      result.ogTitle = decodeHtmlEntities(titleMatch2[1]);
    }
  }

  // Fallback to <title> tag
  if (!result.ogTitle) {
    const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleTagMatch?.[1]) {
      result.ogTitle = decodeHtmlEntities(titleTagMatch[1]);
    }
  }

  // Extract og:description
  const descMatch = html.match(
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  if (descMatch?.[1]) {
    result.ogDescription = decodeHtmlEntities(descMatch[1]);
  } else {
    const descMatch2 = html.match(
      /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["'][^>]*>/i,
    );
    if (descMatch2?.[1]) {
      result.ogDescription = decodeHtmlEntities(descMatch2[1]);
    }
  }

  // Fallback to meta description
  if (!result.ogDescription) {
    const metaDescMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
    );
    if (metaDescMatch?.[1]) {
      result.ogDescription = decodeHtmlEntities(metaDescMatch[1]);
    } else {
      const metaDescMatch2 = html.match(
        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i,
      );
      if (metaDescMatch2?.[1]) {
        result.ogDescription = decodeHtmlEntities(metaDescMatch2[1]);
      }
    }
  }

  // Extract og:image
  const imageMatch = html.match(
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  if (imageMatch?.[1]) {
    result.ogImage = decodeHtmlEntities(imageMatch[1]);
  } else {
    const imageMatch2 = html.match(
      /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i,
    );
    if (imageMatch2?.[1]) {
      result.ogImage = decodeHtmlEntities(imageMatch2[1]);
    }
  }

  // Extract favicon
  const faviconMatch = html.match(
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["'][^>]*>/i,
  );
  if (faviconMatch?.[1]) {
    result.favicon = decodeHtmlEntities(faviconMatch[1]);
  } else {
    const faviconMatch2 = html.match(
      /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*>/i,
    );
    if (faviconMatch2?.[1]) {
      result.favicon = decodeHtmlEntities(faviconMatch2[1]);
    }
  }

  return result;
};

const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, "g"), char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) =>
    String.fromCharCode(parseInt(num, 10)),
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );

  return result;
};

const getOpenGraph = async (targetUrl: URL): Promise<OgResult | undefined> => {
  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "bot",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(
        `[remark-link-card-plus] Error: Failed to fetch ${targetUrl} - ${response.status}`,
      );
      return undefined;
    }

    const html = await response.text();
    return parseOgTags(html);
  } catch (error) {
    console.error(
      `[remark-link-card-plus] Error: Failed to get the Open Graph data of ${targetUrl} due to ${error}.`,
    );
    return undefined;
  }
};

const getFaviconImageSrc = async (url: URL) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}`;

  try {
    const res = await fetch(faviconUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return "";

    return faviconUrl;
  } catch {
    return "";
  }
};

const getLinkCardData = async (url: URL, options: Options) => {
  const ogRawResult = await getOpenGraph(url);
  let ogData: OgData = {
    title: ogRawResult?.ogTitle || "",
    description: ogRawResult?.ogDescription || "",
    faviconUrl: ogRawResult?.favicon,
    imageUrl: ogRawResult?.ogImage,
  };

  if (options.ogTransformer) {
    ogData = options.ogTransformer(ogData, url);
  }

  const title = ogData?.title || url.hostname;
  const description = ogData?.description || "";
  const faviconUrl = await getFaviconUrl(url, ogData?.faviconUrl, options);
  const ogImageUrl = getOgImageUrl(url, ogData.imageUrl, options);

  let displayUrl = options.shortenUrl ? url.hostname : url.toString();
  try {
    displayUrl = decodeURI(displayUrl);
  } catch (error) {
    console.error(
      `[remark-link-card-plus] Error: Cannot decode url: "${url}"\n ${error}`,
    );
  }

  return {
    title,
    description,
    faviconUrl,
    ogImageUrl,
    displayUrl,
    url,
  };
};

const getFaviconUrl = async (
  url: URL,
  ogFavicon: string | undefined,
  options: Options,
) => {
  if (options.noFavicon) return "";

  let faviconUrl = ogFavicon;
  if (faviconUrl && !URL.canParse(faviconUrl)) {
    try {
      faviconUrl = new URL(faviconUrl, url.origin).toString();
    } catch (error) {
      console.error(
        `[remark-link-card-plus] Error: Failed to resolve favicon URL ${faviconUrl} relative to ${url}\n${error}`,
      );
      faviconUrl = undefined;
    }
  }

  if (!faviconUrl) {
    faviconUrl = await getFaviconImageSrc(url);
  }

  return faviconUrl;
};

const getOgImageUrl = (
  baseUrl: URL,
  imageUrl: string | undefined,
  options: Options,
) => {
  if (options.noThumbnail) return "";

  if (!imageUrl || imageUrl.length === 0) return "";

  // Handle relative URLs
  if (!URL.canParse(imageUrl)) {
    try {
      return new URL(imageUrl, baseUrl.origin).toString();
    } catch {
      return "";
    }
  }

  return imageUrl;
};

const className = (value: string) => {
  const prefix = "remark-link-card-plus";
  return `${prefix}__${value}`;
};

const createLinkCardNode = (data: LinkCardData, options: Options): Html => {
  const { title, description, faviconUrl, ogImageUrl, displayUrl, url } = data;
  const isThumbnailLeft = options.thumbnailPosition === "left";

  const thumbnail = ogImageUrl
    ? `
<div class="${className("thumbnail")}">
  <img src="${ogImageUrl}" class="${className("image")}" alt="">
</div>`.trim()
    : "";

  const mainContent = `
<div class="${className("main")}">
  <div class="${className("content")}">
    <div class="${className("title")}">${sanitizeHtml(title)}</div>
    <div class="${className("description")}">${sanitizeHtml(description)}</div>
  </div>
  <div class="${className("meta")}">
    ${faviconUrl ? `<img src="${faviconUrl}" class="${className("favicon")}" width="14" height="14" alt="">` : ""}
    <span class="${className("url")}">${sanitizeHtml(displayUrl)}</span>
  </div>
</div>
`
    .replace(/\n\s*\n/g, "\n")
    .trim();

  const content = isThumbnailLeft
    ? `
${thumbnail}
${mainContent}`
    : `
${mainContent}
${thumbnail}`;

  return {
    type: "html",
    value: `
<div class="${className("container")}">
  <a href="${url.toString()}" target="_blank" rel="noreferrer noopener" class="${className("card")}">
    ${content.trim()}
  </a>
</div>
`.trim(),
  };
};

export default remarkLinkCard;
