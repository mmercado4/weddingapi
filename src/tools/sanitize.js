const sanitizeString = (str) => {
  let sanitizeRegex = /[*+^<>=${}()|[\]\\]/g;
  return str.replace(sanitizeRegex, "");
};

const sanitizeObject = (obj) => {
  let sanitizeRegex = /[*+^<>=${}()|[\]\\]/g;
  let sanitizeObj = {};
  let subObj = {};
  for (item in obj) {
    if (typeof obj[item] === "string") {
      sanitizeObj[item] = obj[item].replace(sanitizeRegex, "");
    } else if (typeof obj[item] === "object") {
      for (i in item) {
        subObj[i] = item[i].replace(sanitizeRegex, "");
      }
      sanitizeObj[item] = subObj;
    }
  }
  return sanitizeObj;
};

module.exports = {
  sanitizeString: sanitizeString,
  sanitizeObject: sanitizeObject,
};
