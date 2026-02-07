const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required');
  }

  if (username && username.length > 100) {
    errors.push('Username too long');
  }

  if (password && password.length > 100) {
    errors.push('Password too long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateItem = (req, res, next) => {
  const { title, category } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (title && title.length > 200) {
    errors.push('Title too long (max 200 characters)');
  }

  const validCategories = ['readymade', 'cloth', 'material', 'coming-soon'];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateReview = (req, res, next) => {
  const { text, name, stars } = req.body;
  const errors = [];

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    errors.push('Review text is required');
  }

  if (text && text.length > 500) {
    errors.push('Review text too long (max 500 characters)');
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (name && name.length > 100) {
    errors.push('Name too long (max 100 characters)');
  }

  if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
    errors.push('Stars must be a number between 1 and 5');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateIndex = (req, res, next) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid index parameter'
    });
  }

  req.params.index = index;
  next();
};

module.exports = {
  validateLogin,
  validateItem,
  validateReview,
  validateIndex
};
