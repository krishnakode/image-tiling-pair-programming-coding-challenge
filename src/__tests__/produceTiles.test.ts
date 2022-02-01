import produceTiles from "../produceTiles";
import { Image } from "../Image";

const mockResize = jest.fn();
const mockSave = jest.fn();
const mockExtract = jest.fn();

const createImageMock = (
  properties: { width: number; height: number },
  mocks = { mockResize, mockSave, mockExtract }
): Image => {
  return {
    resize: mocks.mockResize.mockImplementation(
      (width: number, height: number) =>
        createImageMock({ width, height }, mocks)
    ),
    save: mocks.mockSave,
    extract: mocks.mockExtract.mockImplementation(
      (left: number, top: number, width: number, height: number) =>
        createImageMock({ width, height }, mocks)
    ),
    properties,
  };
};

describe("produceTiles", () => {
  beforeEach(() => {
    mockSave.mockClear();
    mockResize.mockClear();
    mockExtract.mockClear();
  });
  it("should produce a correctly sized tiles if square and image size is equal to tile size", async () => {
    await produceTiles(createImageMock({ width: 4, height: 4 }), "path", 4, {
      prepareLevelDirectory: async (path, level) => `${path}/${level}`,
    });
    expect(mockSave).toHaveBeenCalledTimes(3);
    expect(mockSave).toHaveBeenCalledWith("path/0/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/1/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/2/0_0.png");
  });
  it("should produce a correct tiles for levels at greater resolution than maxTileDimension for square image", async () => {
    expect(true).toBe(false);
  });
});
