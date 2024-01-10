const authenticationMiddleware = (req, res, next) => {
    const authHeaderValue = req.header('Auth');
    const expectedAuthValue = 'Aditya_Backend';
  
    if (authHeaderValue === expectedAuthValue) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  module.exports = authenticationMiddleware;
  