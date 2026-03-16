const FeedInventory = require('../models/FeedInventory');
const Animal = require('../models/Animal');

// @GET /api/feed
const getFeedInventory = async (req, res, next) => {
  try {
    const inventory = await FeedInventory.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, inventory });
  } catch (err) { next(err); }
};

// @POST /api/feed
const createFeedItem = async (req, res, next) => {
  try {
    const item = await FeedInventory.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, item });
  } catch (err) { next(err); }
};

// @GET /api/feed/recommendations
const getFeedRecommendations = async (req, res, next) => {
  try {
    const animals = await Animal.find({ owner: req.user._id });
    const recommendations = animals.map(animal => {
      let rec = 'Standard Forage Mix';
      let reason = 'Maintenance level';
      
      if (animal.healthStatus === 'pregnant') {
        rec = 'High-Protein Grain + Mineral Block';
        reason = 'Support fetal growth and maternal health';
      } else if (animal.healthStatus === 'sick') {
        rec = 'Medicated Soft Feed + Electrolytes';
        reason = 'Aiding recovery and hydration';
      } else if (animal.age < 1) {
        rec = 'Calf Starter + Milk Substitute';
        reason = 'Optimizing early growth phase';
      } else if (animal.weight > 500) {
        rec = 'Enhanced Concentrates + Legume Hay';
        reason = 'Maintaining high body mass';
      }

      return {
        animalId: animal.animalId,
        animalName: animal.name,
        recommendation: rec,
        reason: reason
      };
    });

    res.json({ success: true, recommendations });
  } catch (err) { next(err); }
};

// @PUT /api/feed/:id
const updateFeedItem = async (req, res, next) => {
  try {
    const item = await FeedInventory.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (err) { next(err); }
};

// @DELETE /api/feed/:id
const deleteFeedItem = async (req, res, next) => {
  try {
    const item = await FeedInventory.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) { next(err); }
};

module.exports = { getFeedInventory, createFeedItem, getFeedRecommendations, updateFeedItem, deleteFeedItem };

