const detectDepartment = (text) => {
  text = text.toLowerCase();

  if (text.includes("dirty") || text.includes("washroom"))
    return "Cleaning";
  if (text.includes("blood") || text.includes("injury"))
    return "Medical";
  if (text.includes("theft") || text.includes("fight"))
    return "Security";
  if (text.includes("ac not working"))
    return "Technical";
  if (text.includes("food"))
    return "Catering";

  return "General";
};

const detectPriority = (text) => {
  text = text.toLowerCase();

  if (text.includes("emergency") || text.includes("fire"))
    return "Emergency";
  if (text.includes("urgent"))
    return "Medium";

  return "Normal";
};

const detectRegion = (pnr) => {
  if (!pnr) return "Unknown";

  const prefix = pnr.substring(0, 2);

  const regionMap = {
    "12": "Northern Railway",
    "22": "Eastern Railway",
    "33": "Western Railway",
    "44": "Southern Railway",
  };

  return regionMap[prefix] || "General Region";
};

module.exports = { detectDepartment, detectPriority, detectRegion };
