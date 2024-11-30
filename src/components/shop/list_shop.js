// import React, { useEffect, useState } from 'react';
// import { Link } from "react-router-dom";
// import './Listshop.css'; // Import custom CSS
// import re from '../img/004.gif'; // นำเข้ารูปภาพ
// export default function Listshop() {
//   const [products, setProducts] = useState([]); // สร้าง state สำหรับเก็บข้อมูลสินค้า
//   const [storeInfo, setStoreInfo] = useState({}); // สร้าง state สำหรับเก็บข้อมูลร้านค้า
//   const [loading, setLoading] = useState(true);
//   // ฟังก์ชันเพื่อดึงข้อมูลจาก API
//   const fetchProducts = () => {
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };

//     fetch("${process.env.REACT_APP_API}/users.php?service=list_product", requestOptions)
//       .then((response) => response.json()) // เปลี่ยนเป็น response.json() เพื่อแปลงเป็น JSON
//       .then((data) => {
//         // เช็คการตอบกลับของ API และตั้งค่า state
//         if (data.response) {
//           setLoading(false);
//           setProducts(data.response);
//           // สมมติว่าข้อมูลร้านค้าอยู่ใน data.storeInfo
//           setStoreInfo({
//             store_name: "Armmy Shop Online",
//             img_profile_store: "store_profile/671f03bcd12f8_text-logo zooeticket-line-01.png"
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data: ", error);
//         setLoading(false);
//       });
//   };

//   // ใช้ useEffect เพื่อดึงข้อมูลเมื่อโหลดคอมโพเนนต์
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // ฟังก์ชันเพื่อแสดงดาวตามคะแนน
//   const renderStars = (rating) => {
//     const stars = [];
//     const totalStars = 5;

//     // ถ้าคะแนนไม่มีหรือเป็น 0 ให้แสดงดาวสีเทา
//     if (!rating || rating <= 0) {
//       for (let i = 0; i < totalStars; i++) {
//         stars.push(<span key={i} className="text-secondary">☆</span>); // ดาวสีเทา
//       }
//     } else {
//       const fullStars = Math.floor(rating);
//       const halfStar = rating % 1 !== 0;

//       for (let i = 0; i < fullStars; i++) {
//         stars.push(<span key={i} className="text-warning">⭐</span>); // ดาวสีเหลือง
//       }
//       if (halfStar) {
//         stars.push(<span key={fullStars} className="text-warning">⭐️</span>); // ดาวครึ่ง
//       }
//       while (stars.length < totalStars) {
//         stars.push(<span key={stars.length} className="text-secondary">☆</span>); // ดาวสีเทา
//       }
//     }

//     return stars;
//   };
//   if (loading) {
//     return (
//       <div className="loading">
//         <img width={100} src={re} alt="Loading..." />
//         Loading...
//       </div>
//     );
//   }
//   return (
//     <div className='container py-5'>
//       <div className="row text-center pt-3">
//         <div className="col-lg-6 m-auto">
//           <h1 className="display-4 text-primary">ของที่ระลึกน้องหมูเด้ง สุด Exclusive</h1>
//           <p className="lead">
//             สามารถเป็นเจ้าของก่อนใครได้ผ่าน Line Official : Zoo E-Ticket By@pay
//           </p>
//         </div>
//       </div>

// {/* เมนูที่มีสไตล์ */}
// <div className="mb-4">
//   <ul className="nav nav-pills justify-content-center custom-nav">
//     <li className="nav-item">
//       <Link className="nav-link active" to="/orders">
//         <span className="h5">สินค้า</span>
//         <span className="position-absolute left-100 badge rounded-pill bg-danger h6 text-light">
//           0
//         </span>
//       </Link>
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link active" to="/orders">
//         <span className="h5">คำสั่งซื้อ</span>
//         <span className="position-absolute left-100 badge rounded-pill bg-danger h6 text-light">
//           0
//         </span>
//       </Link>
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link" to="/cart">
//         <span className="h5">ตะกร้าสินค้า</span>
//         <span className="position-absolute left-100 badge rounded-pill bg-danger h6 text-light">
//           0
//         </span>
//       </Link>
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link" to="/address">
//         <span className="h5">เพิ่มที่อยู่จัดส่ง</span>
//         <span className="position-absolute left-100 badge rounded-pill bg-danger h6 text-light">
//           0
//         </span>
//       </Link>
//     </li>
//   </ul>
// </div>

//       <div className="col-md-12 pb-4">
//         <div className="d-flex">
//           <label className="form-label">เลือกดูสินค้าตามหมวดหมู่:</label>
//           <select className="form-control ms-2">
//             <option>Featured</option>
//             <option>A to Z</option>
//             <option>Item</option>
//           </select>
//         </div>
//       </div>

//       <div className="row">
//         {products.map(product => (
//           <div className="col-6 col-md-4 mb-4" key={product.id_product}>
//             <div className="card shadow border-0 rounded position-relative overflow-hidden">
//               <Link to='/Addcar'>
//                 <img src={`${process.env.REACT_APP_API}/${product.preview_product}`} alt={product.name_product} className="card-img-top rounded-top" />
//               </Link>
//               <div className="card-body text-center">
//                 {/* แสดงชื่อร้านและโลโก้ */}
//                 <div className="mb-2">
//                   <img src={`${process.env.REACT_APP_API}/${storeInfo.img_profile_store}`} alt={storeInfo.store_name} className="img-fluid rounded-circle mb-1" style={{ width: '50px', height: '50px' }} />
//                   <h6>{storeInfo.store_name}</h6>
//                 </div>
//                 <h5 className="card-title">{product.name_product}</h5>
//                 <p className="h4 text-success">฿{product.price_product}</p>
//                 <p className="text-muted">{product.product_detall}</p>
//                 <p className="text-warning">
//                   คะแนนรีวิว: {renderStars(product.average_rating)} ({product.average_rating})
//                 </p>
//                 <Link to='/Addcar' className="btn btn-primary btn-lg w-100">สั่งซื้อ</Link>
//               </div>
//               <div className="overlay"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Listshop.css'; // Import custom CSS
import re from '../img/004.gif'; // นำเข้ารูปภาพ
import Cart from './cart'
import AddressShop from './address_shop'
import Orders from './order_shop'

// สร้างคอมโพเนนต์ที่แตกต่างกัน
// const Orders = () => <div>คำสั่งซื้อ</div>;
// const Cart = () => <div>ตะกร้าสินค้า</div>;
// const Address = () => <div>เพิ่มที่อยู่จัดส่ง</div>;

export default function Listshop() {
  const [products, setProducts] = useState([]); // สร้าง state สำหรับเก็บข้อมูลสินค้า
  const [storeInfo, setStoreInfo] = useState({}); // สร้าง state สำหรับเก็บข้อมูลร้านค้า
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState('products'); // สร้าง state สำหรับจัดการคอมโพเนนต์ที่แสดง
  const [user_address_count, setuser_address_count] = useState(0);
  const [orders_count, setorders_count] = useState(0);
  const [shopping_cart_count, setshopping_cart_count] = useState(0);
  const line_token = localStorage.getItem('token');
  const iduser = localStorage.getItem('userid');
  const navigate = useNavigate();
  // ฟังก์ชันเพื่อดึงข้อมูลจาก API
  const fetchProducts = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(process.env.REACT_APP_API+"/users.php?service=list_product", requestOptions)
      .then((response) => response.json()) // เปลี่ยนเป็น response.json() เพื่อแปลงเป็น JSON
      .then((data) => {
        // เช็คการตอบกลับของ API และตั้งค่า state
        if (data.response) {
          setLoading(false);
          setProducts(data.response);
          // สมมติว่าข้อมูลร้านค้าอยู่ใน data.storeInfo
          setStoreInfo({
            store_name: "Armmy Shop Online",
            img_profile_store: "store_profile/671f03bcd12f8_text-logo zooeticket-line-01.png"
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const COunt = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(process.env.REACT_APP_API+"/users.php?service=count&id_user="+iduser, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        localStorage.setItem('countaddress', result.response.user_address_count); 
        setuser_address_count(result.response.user_address_count)
        setorders_count(result.response.orders_count)
        setshopping_cart_count(result.response.shopping_cart_count)
      })
      .catch((error) => console.error(error));
  }

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    const id = localStorage.getItem('userid');

    // ตรวจสอบ token และ id ถ้าไม่มีให้เปลี่ยนเส้นทางไปยังหน้า /Shop_partner/shop/Shopconnext
    if (!id) {
      navigate('/Shopconnext');
    }
    fetchProducts();
    COunt();
  }, []);

  // ฟังก์ชันเพื่อแสดงดาวตามคะแนน
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5;

    // ถ้าคะแนนไม่มีหรือเป็น 0 ให้แสดงดาวสีเทา
    if (!rating || rating <= 0) {
      for (let i = 0; i < totalStars; i++) {
        stars.push(<span key={i} className="text-secondary">☆</span>); // ดาวสีเทา
      }
    } else {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 !== 0;

      for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={i} className="text-warning">⭐</span>); // ดาวสีเหลือง
      }
      if (halfStar) {
        stars.push(<span key={fullStars} className="text-warning">⭐️</span>); // ดาวครึ่ง
      }
      while (stars.length < totalStars) {
        stars.push(<span key={stars.length} className="text-secondary">☆</span>); // ดาวสีเทา
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="loading">
        <img width={100} src={re} alt="Loading..." />
        Loading...
      </div>
    );
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case 'orders':
        return <Orders />;
      case 'cart':
        return <Cart />;
      case 'address':
        return <AddressShop />;
      default:
        return (
          <>
            <div className="row text-center pt-3">
              <div className="col-lg-6 m-auto">
                <h4 className="display-6 text-primary">ของที่ระลึกน้องหมูเด้ง สุด Exclusive</h4>
                <p className="lead">
                  สามารถเป็นเจ้าของก่อนใครได้ผ่าน Line Official : Zoo E-Ticket By@pay
                </p>
              </div>
            </div>
            <div className="row">
              {products.map(product => (
                <div className="col-6 col-md-3 mb-4" key={product.id_product}>
                  <Link style={{ textDecoration: 'none' }}
                    key={product.id_product}
                    to="/Addcar"
                    state={{ id: product.id_product }} className="card shadow border-0 rounded position-relative overflow-hidden">
                    <img src={`${process.env.REACT_APP_API}/${product.preview_product}`} alt={product.name_product} className="card-img-top rounded-top" />
                    <div className="card-body text-center">
                      {/* แสดงชื่อร้านและโลโก้ */}
                      <div className="mb-2">
                        <img src={`${process.env.REACT_APP_API}/${product.img_profile_store}`} alt={storeInfo.store_name} className="img-fluid rounded-circle mb-1" style={{ width: '50px', height: '50px' }} />
                        {/* <h6>{product.store_name}</h6> */}
                      </div>
                      <h5 className="card-title">{product.name_product}</h5>
                      <p className="h5 text-success">฿{product.price_product}</p>
                      <p className="text-warning">
                        คะแนนรีวิว: {renderStars(product.average_rating)} ({product.average_rating})
                      </p>
                    </div>
                    <div className="overlay"></div>
                  </Link>
                </div>
              ))}

            </div>
          </>
        );
    }
  };

  return (
    <div className='container py-5'>



<div>
      {/* โปรไฟล์ผู้ใช้ */}
      <div className="profile-container text-center mb-4">
        <img
          src={ localStorage.getItem('profile') || 'default-profile.png'}
          alt="User Profile"
          className="rounded-circle img-fluid"
          style={{ width: '80px', height: '80px' }}
        />
        <h4 className="mt-3">{localStorage.getItem('name') || "ผู้ใช้"}</h4>
        <p className="text-muted">ID: {localStorage.getItem('userid') || "N/A"} {localStorage.getItem('token')}</p>
      </div>

      {/* เมนูที่มีสไตล์ */}
      <div className="mb-4">
        <ul className="nav nav-pills nav-fill custom-nav"> {/* ใช้ nav-fill สำหรับการกระจายเต็มพื้นที่ */}
          <li className="nav-item">
            <Link className="nav-link" onClick={() => setActiveComponent('products')}>
              <span>สินค้า</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={() => setActiveComponent('orders')}>
              <span>คำสั่งซื้อ</span>
              <span className="position-absolute badge rounded-pill bg-danger h6 text-light">{orders_count}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={() => setActiveComponent('cart')}>
              <span>ตะกร้า</span>
              <span className="position-absolute badge rounded-pill bg-danger h6 text-light">{shopping_cart_count}</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={() => setActiveComponent('address')}>
              <span>ที่อยู่</span>
              <span className="position-absolute badge rounded-pill bg-danger h6 text-light">{user_address_count}</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  



      {/* แสดงคอมโพเนนต์ตามที่เลือก */}
      {renderComponent()}
    </div>
  );
}
