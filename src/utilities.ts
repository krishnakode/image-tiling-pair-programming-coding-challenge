import { join } from "path";
import fs from "fs-extra";

export const setupOutputDir = async (path: string) => {
  const exists = await fs.pathExists(path);
  if (exists) {
    await fs.emptyDir(path);
    return;
  }
  await fs.mkdir(path);
};

export const prepareLevelDirectory = async (
  outputPath: string,
  level: number
) => {
  const tileLevelDirectory = join(outputPath, `${level}`);
  await fs.mkdir(tileLevelDirectory);
  return tileLevelDirectory;
};

export const getImageName = (x: number, y: number) => `${x}_${y}.png`;

export const parseArgs = async (args: string[] | any[]) => {
  const imagePath = args[0];
  const maxTileDimension = args[1] ? new RegExp('^\d+$').test(args[1]);
  if (typeof imagePath !== "string") {
    throw Error("Must pass path to image as first argument to script.");
  }
  if (typeof maxTileDimension !== "number") {
    throw Error("Must pass path to image as first argument to script.");
  }
  const exists = await fs.pathExists(imagePath);
  if (!exists) {
    throw Error(
      `Path ${imagePath} does not exist. Please check the path and try again.`
    );
  }
  return {
    imagePath,
  };
};
