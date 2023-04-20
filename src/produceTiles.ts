import { Image } from "./Image";
import { getImageName, prepareLevelDirectory } from "./utilities";
import { join } from "path";

const produceTiles = async (
  image: Image,
  outputPath: string,
  maxTileDimension: number,
  deps = { prepareLevelDirectory }
) => {
  const { width, height } = image.properties;
  const maxDimension = Math.max(width, height);
  const numberOfLevels = Math.ceil(1 + Math.log2(maxDimension));

  console.log(`Number of levels expected: ${numberOfLevels}`);

  for (let tileLevel = 0; tileLevel < numberOfLevels; tileLevel++) {
    // because tileLevels start at 0 and not 1 we need to subtract 1 in order to have 1*1 pixel at the lowest level
    // and the levelMaxDimension at the highest level equal to the full resolution of the image
    const levelMaxDimension = Math.ceil(
      maxDimension / 2 ** (numberOfLevels - 1 - tileLevel)
    );
    const tileLevelDirectory = await deps.prepareLevelDirectory(
      outputPath,
      tileLevel
    );

    // TODO: should handle rectangles to get ratio of sides
    const resized = await image.resize(levelMaxDimension, levelMaxDimension);
    const levelWidth = resized.properties.width;
    const levelHeight = resized.properties.height;

    console.log('levelMaxDimension:', levelMaxDimension, resized.properties);
    // TODO: if the max dimension is greater than the maximum allowed tile size cut it up into tiles
    if (levelMaxDimension >= maxTileDimension) {
      /* const extracted = await resized.extract(
        0,
        0,
        maxTileDimension,
        maxTileDimension
      );
      await extracted.save(join(tileLevelDirectory, getImageName(0, 0))); */
      for (let i = 0; i < levelWidth; i = i+maxTileDimension) {
        for (let j = 0; j < levelHeight; j = j+maxTileDimension) {
          const widthToExtract = Math.min(levelWidth-i, maxTileDimension);
          const heightToExtract = j+maxTileDimension > levelHeight ? levelHeight-j : maxTileDimension;
          console.log('-->', i, j, widthToExtract, heightToExtract);
          const extracted = await resized.extract(
            i,
            j,
            widthToExtract,
            heightToExtract,
          );
          await extracted.save(join(tileLevelDirectory, getImageName(i, j)));
        }
      }
    } else {
      await resized.save(join(tileLevelDirectory, getImageName(0, 0)));
    }
  }
};

export default produceTiles;
