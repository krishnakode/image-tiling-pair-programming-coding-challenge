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

  it("should produce the correct tiles if the image is square and its size is equal to the maxTileDimension", async () => {
    await produceTiles(createImageMock({ width: 4, height: 4 }), "path", 4, {
      prepareLevelDirectory: async (path, level) => `${path}/${level}`,
    });
    expect(mockSave).toHaveBeenCalledTimes(3);
    expect(mockSave).toHaveBeenCalledWith("path/0/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/1/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/2/0_0.png");
  });

  it("should produce the correct tiles if the image is square and its size is double the maxTileDimension", async () => {
    await produceTiles(createImageMock({ width: 8, height: 8 }), "path", 4, {
      prepareLevelDirectory: async (path, level) => `${path}/${level}`,
    });
    expect(mockSave).toHaveBeenCalledTimes(7);
    expect(mockSave).toHaveBeenCalledWith("path/0/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/1/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/2/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/3/0_0.png");
    expect(mockSave).toHaveBeenCalledWith("path/3/0_4.png");
    expect(mockSave).toHaveBeenCalledWith("path/3/4_4.png");
    expect(mockSave).toHaveBeenCalledWith("path/3/4_0.png");
    expect(mockExtract).toHaveBeenCalledTimes(5);
    expect(mockExtract).toHaveBeenCalledWith(0, 0, 4, 4);
    expect(mockExtract).toHaveBeenCalledWith(0, 4, 4, 4);
    expect(mockExtract).toHaveBeenCalledWith(4, 0, 4, 4);
    expect(mockExtract).toHaveBeenCalledWith(4, 4, 4, 4);
  });
});
