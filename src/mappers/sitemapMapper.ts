import { SitemapData, SitemapArea, SitemapSubArea } from "../types/sitemap";

const getLocalizedTitle = (node: Element, lcid?: number): string => {
  // Try to get localized title from Titles child elements
  if (lcid) {
    const titlesNode = node.querySelector("Titles");
    if (titlesNode) {
      const titleNodes = titlesNode.querySelectorAll("Title");
      for (const titleNode of titleNodes) {
        const titleLcid = titleNode.getAttribute("LCID");
        if (titleLcid && parseInt(titleLcid) === lcid) {
          const name = titleNode.getAttribute("Title");
          if (name) return name;
        }
      }
    }
  }

  // Fallback to default title or ResourceId
  return (
    node.getAttribute("Title") ||
    node.getAttribute("ResourceId") ||
    node.getAttribute("Id") ||
    ""
  );
};

export const mapSitemap = (sitemapXml: string, lcid?: number): SitemapData => {
  try {
    if (!sitemapXml) {
      console.log("No sitemap XML provided");
      return { areas: [], subAreas: [] };
    }

    console.log(`Parsing sitemap with LCID: ${lcid || "default"}`);

    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapXml, "text/xml");

    // Extract Areas
    const areas: SitemapArea[] = [];
    const areaNodes = xmlDoc.querySelectorAll("SiteMap > Area");

    areaNodes.forEach((areaNode) => {
      const id = areaNode.getAttribute("Id");
      const title = getLocalizedTitle(areaNode, lcid);

      if (id) {
        areas.push({ id, title: title || id });
      }
    });

    // Extract SubAreas
    const subAreas: SitemapSubArea[] = [];
    const subAreaNodes = xmlDoc.querySelectorAll(
      "SiteMap > Area > Group > SubArea"
    );

    subAreaNodes.forEach((subAreaNode) => {
      const id = subAreaNode.getAttribute("Id");
      const title = getLocalizedTitle(subAreaNode, lcid);

      // Find parent area
      let areaId = "";
      let parent = subAreaNode.parentElement;
      while (parent && parent.tagName !== "Area") {
        parent = parent.parentElement;
      }
      if (parent) {
        areaId = parent.getAttribute("Id") || "";
      }

      if (id && areaId) {
        subAreas.push({ id, title: title || id, areaId });
      }
    });

    console.log(
      `Mapped ${areas.length} areas and ${subAreas.length} subareas from sitemap`,
      areas,
      subAreas
    );
    return { areas, subAreas };
  } catch (error) {
    console.error("Error parsing sitemap XML:", error);
    return { areas: [], subAreas: [] };
  }
};
