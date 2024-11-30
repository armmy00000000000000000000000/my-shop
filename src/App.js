import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

import AddressShop from './components/shop/address_shop';
import Listshop from './components/shop/list_shop';
import Addcar from './components/shop/add_cart';
import OrdeShop from './components/shop/order_shop';
import Cart from './components/shop/cart';
import ShopPayment from './components/shop/shop_payment';
import Shopconnext from './components/auth/shop_context';

function App() {
  const [showRoutes, setShowRoutes] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // const id = localStorage.getItem('id');

    // // ตรวจสอบ token และ id ถ้าไม่มีให้เปลี่ยนเส้นทางไปยังหน้า /Shop_partner/shop/Shopconnext
    // if (!id) {
    //   navigate('/Shopconnext');
    // }

    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      // หากเวลาอยู่ในช่วง 22:30 ถึง 00:59 ให้ซ่อนเส้นทางการใช้งาน
      if ((hours === 22 && minutes >= 30) || hours === 23 || (hours === 0 && minutes < 60)) {
        setShowRoutes(false);
      } else {
        setShowRoutes(true);
      }
    };

    checkTime(); // ตรวจสอบเวลาเมื่อเริ่มต้น

    const intervalId = setInterval(checkTime, 5000); // ตรวจสอบทุก ๆ 5 วินาที

    return () => clearInterval(intervalId); // ทำความสะอาด interval เมื่อ component ถูก unmounted
  }, [navigate]);

  return (
    <div>
      {!showRoutes && (
        <div className="notificationtime">
          <h2>เวลาปัจจุบัน: {currentTime}</h2>
          <p className="text-danger">เวลานี้ระบบปิดให้บริการ เปิดให้บริการอีกในเวลา 01:00 น.</p>
        </div>
      )}

      {showRoutes && (
        <Routes>
          <Route path="/" element={<Listshop />} />
          <Route path="/AddressShop" element={<AddressShop />} />
          <Route path="/Shopconnext" element={<Shopconnext />} />
          <Route path="/Listshop" element={<Listshop />} />
          <Route path="/Addcar" element={<Addcar />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/OrdeShop" element={<OrdeShop />} />
          <Route path="/ShopPayment" element={<ShopPayment />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
