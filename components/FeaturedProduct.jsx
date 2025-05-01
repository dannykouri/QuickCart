import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.bo_tu_hoc_eng_image,
    title: "Bộ sách luyện thi IELTS Mike 5 cuốn",
    description: "Bộ sách từ kinh nghiệm 20 năm chấm thi IELTS.",
  },
  {
    id: 2,
    image: assets.hsk_book_chinese_image,
    title: "Bộ sách HSK 1-6",
    description: "Bộ sách giúp bạn nắm vững ngữ pháp và từ vựng Tiếng Trung.",
  },
  {
    id: 3,
    image: assets.ls_book_sp_image,
    title: "Power in Every Pixel",
    description: "Shop the latest laptops for work, gaming, and more.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Sản Phẩm Ưu Thích</p>
        <div className="w-28 h-0.5 bg-cyan-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl text-sky-800">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60 text-gray-400">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-cyan-600 px-4 py-2 rounded">
                Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
