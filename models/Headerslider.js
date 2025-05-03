import mongoose from "mongoose";

const headerSliderSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    offer: {  // Đổi tên từ description sang offer
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    }
  }, { minimize: false });

const HeaderSlider = mongoose.models.headerSlider || mongoose.model("headerSlider", headerSliderSchema);

export default HeaderSlider;