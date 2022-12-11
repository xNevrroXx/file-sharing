function conversionSizeUnits(bytes: number): {amount: string, units: string} {
  const result = {
    amount: bytes,
    units: "Bytes"
  };

  if (result.amount / 1024 > 1) {
    result.amount = (result.amount / 1024);
    result.units = "KB";

    if (result.amount / 1024 > 1) {
      result.amount = (result.amount / 1024);
      result.units = "MB";

      if (result.amount / 1024 > 1) {
        result.amount = (result.amount / 1024);
        result.units = "GB";
      }
    }
  }

  return {
    ...result,
    amount: result.amount.toFixed()
  };
}

module.exports = conversionSizeUnits;