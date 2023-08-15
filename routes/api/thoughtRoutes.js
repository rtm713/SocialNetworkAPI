const router = require("express").Router();
const {
  getThought,
  getSingleThought,
  updateThought,
  deleteThought,
  createThought,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtsControllers");


router.route("/").get(getThought).post(createThought);

router.route("/:thoughtId").get(getSingleThought).put(updateThought).delete(deleteThought);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);


module.exports = router;