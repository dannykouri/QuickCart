import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        { name: 'Thêm Sản Phẩm', path: '/seller', icon: assets.add_icon },
        { name: 'Mục Sản Phẩm', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Đặt Hàng', path: '/seller/orders', icon: assets.order_icon },
        { name: 'Thanh Trượt Sự Kiện', path: '/seller/header-slider', icon: assets.settings_slider },
    ];

    return (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-cyan-600/10 border-cyan-500/90"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="w-7 h-7"
                            />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
