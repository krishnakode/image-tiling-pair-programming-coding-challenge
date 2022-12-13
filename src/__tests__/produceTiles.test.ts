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

  it("should produce the correct tiles if the image is square its size is equal to the maxTileDimension", async () => {
    await produceTiles(createImageMock({ width: 4, height: 4 }), "path", 4, {
      prepareLevelDirectory: async (path, level) => `${path}/${level}`,
    });
    expect(mockSave).toHaveBeenCalledTimes(3);
    expect(mockSave).toHaveBeenCalledWith("path/0/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/1/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/2/0_0.png");
  });

  it("should produce a the correct tiles if the image is square and its size is double the maxTileDimension", async () => {
    // TODO: Write this test
    expect(true).toBe(false);
  });
});
