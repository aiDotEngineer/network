type PhotoFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

type Formats = {
  thumbnail?: PhotoFormat;
  small?: PhotoFormat;
  medium?: PhotoFormat;
  large?: PhotoFormat;
};

/**
 * This is really specific to the way our data comes from the CMS.
 * We should probably abstract this somehow.
 */
export function getBestPhoto(photo: {
  url: string;
  formats: Formats | null;
}): string {
  const { url, formats } = photo;
  return (
    formats?.large?.url ?? formats?.medium?.url ?? formats?.small?.url ?? url
  );
}
