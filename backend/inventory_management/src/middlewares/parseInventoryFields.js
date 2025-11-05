function parseInventoryFields(req, res, next) {
  const fieldsToParse = [
    'tags',
    'accessUsers',
    'customIdElements',
    'customFields'
  ];

  fieldsToParse.forEach((field) => {
    if (req.body[field]) {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        console.error(`Error parsing ${field}:`, err.message);
      }
    }
  });

  // convert string booleans and numbers
  if (req.body.isPublic === 'true') req.body.isPublic = true;
  if (req.body.isPublic === 'false') req.body.isPublic = false;
  if (req.body.version) req.body.version = parseInt(req.body.version, 10);

  next();
}

module.exports = parseInventoryFields;
