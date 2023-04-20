import sharp from "sharp";
import fs from "fs-extra";
import { getImage } from "./Image";
import { parseArgs, setupOutputDir } from "./utilities";
import produceTiles from "./produceTiles";

const outputDirectory = "./tiled-image";
const MAX_TILE_DIMENSION_PIXELS = 256;

const main = async () => {
  const args = process.argv.slice(2);
  const { imagePath, givenMaxTileDimension } = await parseArgs(args);
  await setupOutputDir(outputDirectory);
  const image = await getImage(sharp(imagePath));
  await produceTiles(image, outputDirectory, MAX_TILE_DIMENSION_PIXELS);
};

main().catch((err) => {
  if (err instanceof Error) {
    console.log(err.message);
  }
  process.exit(1);
});
