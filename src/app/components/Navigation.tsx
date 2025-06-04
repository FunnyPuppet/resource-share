"use client";

import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white w-full shadow-sm">
        <div className="flex justify-end items-center p-4 md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:justify-center md:gap-6 md:p-4`}>
          <a href="/" className="block py-2 px-4 md:py-0">首页</a>
          <a href="/resource" className="block py-2 px-4 md:py-0">资源分享</a>
          <a href="/share" className="block py-2 px-4 md:py-0">我要分享</a>
          <a href="/help" className="block py-2 px-4 md:py-0">资源帮找</a>
          <a href="/about" className="block py-2 px-4 md:py-0">关于本站</a>
          <a href="/profile" className="block py-2 px-4 md:py-0">个人中心</a>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-30 z-50 md:hidden" 
             onClick={() => setIsOpen(false)}>
        </div>
      )}
      <div className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform 
                      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                      transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex flex-col p-4 space-y-4">
          <a href="/" className="py-2 px-4" onClick={() => setIsOpen(false)}>首页</a>
          <a href="/resource" className="py-2 px-4" onClick={() => setIsOpen(false)}>资源分享</a>
          <a href="/share" className="py-2 px-4" onClick={() => setIsOpen(false)}>我要分享</a>
          <a href="/help" className="py-2 px-4" onClick={() => setIsOpen(false)}>资源帮找</a>
          <a href="/about" className="py-2 px-4" onClick={() => setIsOpen(false)}>关于本站</a>
          <a href="/profile" className="py-2 px-4" onClick={() => setIsOpen(false)}>个人中心</a>
        </div>
      </div>
    </>
  );
}
