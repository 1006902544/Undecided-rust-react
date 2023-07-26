export interface BannerList {
  url?: string;
  img?: string;
}

export interface BannerProps {
  width?: number;
  list: Array<BannerList>;
}
