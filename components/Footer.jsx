import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Những quyển sách và dịch vụ tốt nhất cho bạn. Chúng tôi cam kết cung cấp những sản phẩm chất lượng cao và dịch vụ tận tình nhất.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Công ty</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="#">Trang Chủ</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Giới thiệu</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Liên hệ</a>
              </li>
              <li>
                <a className="hover:underline transition" href="#">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Liên Hệ</h2>
            <div className="text-sm space-y-2">
              <p>84+ 0714486625</p>
              <p>nhasachnhatminh@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Nhật Minh Books All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;