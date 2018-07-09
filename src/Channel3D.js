const MotorCortex = require("@kissmybutton/motorcortex");

class Channel extends MotorCortex.AttributeChannel {
  constructor(props) {
    super(props);

    this.setComboAttributes({
      rotation: ["x", "y", "z"],
      position: ["x", "y", "z"]
    });
  }
}

module.exports = Channel;
