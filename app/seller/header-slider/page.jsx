'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const HeaderSliderList = () => {
  const { router, getToken, user } = useAppContext();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get('/api/header-slider/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", data); // Debug log
  
      if (data?.success) {
        // Xử lý cả 2 trường hợp: data.sliders hoặc data.headerslider
        const sliderData = data.sliders || data.headerslider || [];
        setSliders(sliderData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi tải dữ liệu");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) fetchSliders();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa?')) return;
    
    try {
      setDeletingId(id);
      setLoadingDelete(true);
      const token = await getToken();
      
      await axios.delete(`/api/header-slider/${id}/remove`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Xóa thành công");
      fetchSliders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa");
    } finally {
      setLoadingDelete(false);
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    router.push(`/seller/header-slider/edit-header-slider/${id}`);
  };

  const handleAdd = () => {
    router.push(`/seller/header-slider/add-slider`);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">Danh sách Slider</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Hình ảnh</th>
                  <th className="px-6 py-3 text-left">Tiêu đề</th>
                  <th className="px-6 py-3 text-left hidden md:table-cell">Mô tả</th>
                  <th className="px-6 py-3 text-left">Thao tác</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-gray-200">
                  {sliders.length > 0 ? (
                    sliders.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.image?.[0] || assets.defaultImage} // Lấy phần tử đầu tiên của mảng
                              alt={item.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{item.title}</td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {item.offer || '-'}
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          {/* Các nút thao tác */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        Không có slider nào
                      </td>
                      <td>
                        <button
                          className="bg-blue-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleAdd}
                        >
                          Thêm
                        </button>
                      </td>
                    </tr> 
                  )}
                </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAdd}
            >
              Thêm
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HeaderSliderList;