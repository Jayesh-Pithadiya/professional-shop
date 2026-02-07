const { readJSON, writeJSON } = require('../utils/fileSystem.util');

const REVIEWS_FILE = 'reviews.json';

const getAll = async (req, res, next) => {
  try {
    const reviews = await readJSON(REVIEWS_FILE);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const reviews = await readJSON(REVIEWS_FILE);
    const newReview = {
      ...req.body,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    await writeJSON(REVIEWS_FILE, reviews);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const reviews = await readJSON(REVIEWS_FILE);
    const index = req.params.index;

    if (index >= reviews.length) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    reviews.splice(index, 1);
    await writeJSON(REVIEWS_FILE, reviews);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  remove
};
