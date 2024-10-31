import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const HomeIcon = ({ isSelected }) => {
  return isSelected ? (
    // Icon Home เมื่อถูกเลือก (สีม่วง #7124DD)
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#6D28D9' }}>
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  ) : (
    // Icon Home เมื่อไม่ถูกเลือก (สีเทา)
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
};

const ReportIcon = ({ isSelected }) => {
  return isSelected ? (
    // Icon Report เมื่อถูกเลือก (สีม่วง #7124DD)
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#6D28D9' }}>
      <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
    </svg>
  ) : (
    // Icon Report เมื่อไม่ถูกเลือก (สีเทา)
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
};

const AlertIcon = ({ isSelected }) => {
  return isSelected ? (
    // Icon Alert เมื่อถูกเลือก (สีม่วง #7124DD)
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#6D28D9' }}>
      <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
    </svg>
  ) : (
    // Icon Alert เมื่อไม่ถูกเลือก (สีเทา)
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
};

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Report', path: '/report', icon: ReportIcon },
    { name: 'Alert', path: '/alert', icon: AlertIcon },
  ];

  const isSelected = (path) => location.pathname === path;

  return (
    <div className="h-screen bg-white text-gray-600 w-72 shadow-md fixed">
      <div className="flex items-center justify-center h-24 mt-4">
        <img src="/BizMo Logo.svg" alt="BizMo Logo" className="h-9 w-9 mr-1" />
        <h1 className="text-2xl font-bold text-gray-900">BMS&nbsp;</h1>
        <h1 className="text-2xl font text-gray-900">PROJECT</h1>
      </div>

      <hr className="border-t-1  border-gray-100 mt-2" />

      <ul className="mt-8">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li
              key={item.name}
              className={`px-6 py-3 hover:bg-purple-50 transition-colors ${isSelected(item.path) ? 'font-bold text-black border-r-4 border-purple-600' : 'text-gray-600'}`}
            >
              <Link to={item.path} className="flex items-center w-full ml-4 space-x-4"> {/* เพิ่ม space-x-4 สำหรับระยะห่าง */}
                <IconComponent isSelected={isSelected(item.path)} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
