const express = require('express');
const router = express.Router();
const { getAnimals, createAnimal, getAnimalById, updateAnimal, deleteAnimal, uploadAnimalPhoto } = require('../controllers/animalController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.use(protect);
router.route('/').get(getAnimals).post(createAnimal);
router.route('/:id').get(getAnimalById).put(updateAnimal).delete(deleteAnimal);
router.post('/:id/photo', upload.single('photo'), uploadAnimalPhoto);

module.exports = router;
