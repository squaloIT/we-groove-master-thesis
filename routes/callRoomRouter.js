const express = require('express')
const router = express.Router();
require('./../typedefs');

router.get('/:type/:roomId', (req, res, next) => {
  const callType = req.params.type;
  /** @type { user } user */
  const user = req.session.user;
  res.status(200).render(callType + '_call_room_layout', {
    user,
    jwtUser: req.jwtUser,
  });
})


module.exports = router;