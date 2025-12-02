export interface SitemapArea {
  id: string;
  title: string;
}

export interface SitemapSubArea {
  id: string;
  title: string;
  areaId: string;
}

export interface SitemapData {
  areas: SitemapArea[];
  subAreas: SitemapSubArea[];
}
