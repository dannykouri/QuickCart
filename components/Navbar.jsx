"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const {openSignIn}= useClerk();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-white position sticky top-0 z-50 bg-gradient-to-r from-cyan-500 to-fuchsia-700 ">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Trang Chủ
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Tất Cả Sách
        </Link>
        
        <NavigationMenu className="bg-black text-gray-800 rounded-md shadow-lg">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Danh Mục</NavigationMenuTrigger>
              <NavigationMenuContent >
                <Link href="/all-products/english-books">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sách Tiếng Anh</NavigationMenuLink>
                </Link>
                <Link href="/all-products/chinese-books">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sách Tiếng Trung</NavigationMenuLink>
                </Link>
                <Link href="/all-products/spanish-books">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sách Tiếng Tây Ban Nha</NavigationMenuLink>
                </Link>
                <Link href="/all-products/german-books">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sách Tiếng Đức</NavigationMenuLink>
                </Link>
                <Link href="/all-products/russian-books">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sách Tiếng Nga</NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        { user 
          ? 
          <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </> : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Đăng Nhập / Đăng Ký
        </button>}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        { user 
          ? 
          <>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Home" labelIcon={<HomeIcon/>} onClick={()=> router.push('/')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={()=> router.push('/all-products')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')} />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')} />
            </UserButton.MenuItems>
          </UserButton>
          </> : 
          <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>}
      </div>
    </nav>
  );
};

export default Navbar;