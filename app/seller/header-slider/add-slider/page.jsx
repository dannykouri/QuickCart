'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const AddHeaderSlider = () => {
  const { getToken } = useAppContext();
  const [file, setFile] = useState(null); // Đổi từ files (mảng) sang file (đơn)
  const [title, setTitle] = useState('');
  const [offer, setOffer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra có ảnh không
    if (!file) {
      toast.error("Vui lòng chọn ảnh!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("offer", offer);
    formData.append("image", file); // Đổi từ "images" -> "image" và gửi file trực tiếp
    
    try {
      const token = await getToken();
      const { data } = await axios.post("/api/header-slider/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Thêm header này cho FormData
        },
      });

      if (data.success) {
        toast.success(data.message);
        setFile(null);
        setTitle('');
        setOffer('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Ảnh Sự Kiện</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <label htmlFor="image">
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]); // Lưu trực tiếp file đơn
                }}
                type="file"
                id="image"
                hidden
                accept="image/*" // Chỉ chấp nhận file ảnh
              />
              <Image
                className="max-w-24 cursor-pointer"
                src={file ? URL.createObjectURL(file) : assets.upload_area}
                alt="Uploaded Image"
                width={100}
                height={100}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Tiêu Đề
          </label>
          <input
            id="Events-name"
            type="text"
            placeholder="Nhập Vào đây"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Sự Kiện
          </label>
          <textarea
            id="Events-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Nhập Vào đây"
            onChange={(e) => setOffer(e.target.value)}
            value={offer}
            required
          ></textarea>
        </div>
        <button 
          disabled={loading} 
          type="submit" 
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          {loading ? 'Đang Thêm...' : 'Thêm Sản Phẩm'}
        </button>
      </form>
    </div>
  );
};

export default AddHeaderSlider;