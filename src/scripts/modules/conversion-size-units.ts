function conversionSizeUnits(bytes: number): {size: string, units: string} {
  const result = {
    size: bytes,
    units: "Bytes"
  };

  if (result.size / 1024 > 1) {
    result.size = (result.size / 1024);
    result.units = "KB";

    if (result.size / 1024 > 1) {
      result.size = (result.size / 1024);
      result.units = "MB";

      if (result.size / 1024 > 1) {
        result.size = (result.size / 1024);
        result.units = "GB";
      }
    }
  }

  return {
    ...result,
    size: result.size.toFixed()
  };
}

export default conversionSizeUnits;