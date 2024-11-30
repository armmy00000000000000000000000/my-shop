import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
function ShopPayment() {
  const [paymentMethod, setPaymentMethod] = useState(''); // state สำหรับวิธีชำระเงิน
  const [slipImage, setSlipImage] = useState(null); // state สำหรับรูปสลิป
  const [addresses, setAddresses] = useState([]); // state สำหรับที่อยู่
  const [selectedAddressId, setSelectedAddressId] = useState(null); // state สำหรับที่อยู่ที่เลือก
  const location = useLocation();
  const { idstore , order_number, total_price , quantity ,unit ,product_name,size,img} = location.state || {}; // รับค่าที่ส่งมาจาก navigate
  const iduser = localStorage.getItem('userid');
  const [accountNumber, setaccountNumber] = useState(''); // state สำหรับวิธีชำระเงิน
  const [accountUname, setaccountUname] = useState(''); // state สำหรับวิธีชำระเงิน
  const [accountBname, setaccountBname] = useState(''); // state สำหรับวิธีชำระเงิน
  const [Qrcode, setQrcode] = useState(''); // state สำหรับวิธีชำระเงิน
  // ฟังก์ชันสำหรับดึงข้อมูลที่อยู่จาก API
  useEffect(() => {
    if (!order_number) {
      console.error("ไม่มีข้อมูลคำสั่งซื้อ");
      // อาจใช้ redirect กลับไปที่หน้าก่อนหน้าได้
    }
    listPament();
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(process.env.REACT_APP_API+"/users.php?service=list_address&id_user="+iduser, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          setAddresses(result.response); // เก็บข้อมูลที่อยู่ใน state
        }
      })
      .catch((error) => console.error(error));
  }, []);


  const listPament =() =>{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(`${process.env.REACT_APP_API}/store.php?service=list_payment&id_store=${idstore}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setaccountNumber(result.response[0].number_payment)
        setaccountUname(result.response[0].account_owner)
        setaccountBname(result.response[0].payment_name)
        setQrcode(`${process.env.REACT_APP_API}/${result.response[0].qr_payment}`)
      })
      .catch((error) => console.error(error));
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSlipImage(URL.createObjectURL(file)); // สร้าง URL สำหรับแสดงรูป
    }
  };



  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        alert("คัดลอกเลขที่บัญชีแล้ว!");
      })
      .catch((err) => {
        console.error("คัดลอกไม่สำเร็จ:", err);
      });
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      alert("กรุณาเลือกวิธีชำระเงิน");
      return;
    }
    if (!slipImage) {
      alert("กรุณาอัปโหลดสลิปการชำระเงิน");
      return;
    }
    if (!selectedAddressId) {
      alert("กรุณาเลือกที่อยู่");
      return;
    }

  // สร้าง FormData สำหรับการส่งข้อมูลไปยัง API
  const formdata = new FormData();
  formdata.append("order_number", order_number);
  formdata.append("payment_method", paymentMethod);
  formdata.append("slip", document.querySelector('input[type="file"]').files[0]); // ดึงไฟล์ที่อัปโหลด
  formdata.append("shipping_address", selectedAddressId);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow"
  };

  fetch("https://addpaycrypto.com/Shop_partner/service/users.php?service=payment", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if(result.status === true){
        console.log(result);
        // แสดง SweetAlert
        Swal.fire({
          title: "การชำระเงินเรียบร้อยแล้ว!",
          text: result.message,
          icon: "success",
          confirmButtonText: "Ok"
        }).then((result) => {
          if (result.isConfirmed) {
            // เปลี่ยนหน้าไปที่ /listorder
            window.location.href = "/Shop_partner/shop/Listshop";
          }
        });
      }else{
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถทำการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
 
    })
    .catch((error) => {
      console.error("เกิดข้อผิดพลาดในการชำระเงิน:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถทำการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "Ok"
      });
    });
  };

  return (
    <>    
      <div className="container mt-5 py-5">
        <h2 className="text-center mb-4">หน้าชำระเงิน</h2>

        {/* Card สำหรับแสดงรายการสินค้า */}
        <div className="card mb-4 shadow-lg border-light">
          <div className="card-body">
            <h5 className="card-title">คำสั่งซื้อ: {order_number}</h5>
            <div className="d-flex align-items-center">
              <img src={img} alt="สินค้า" className="img-fluid me-3" style={{ width: '100px' }} />
              <div>
                <h6 className="mb-1">ชื่อสินค้า: {product_name}</h6>
                <h6 className="mb-1">Size: {size || 'สินค้านี้ไม่มีไชต์'}</h6>
                <p className="mb-0">จำนวน: {quantity}</p>
                <p className="mb-0">ราคา: ฿{unit}</p>
                <p className="mb-0 fw-bold">ราคารวม: ฿{total_price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 text-center">
          <h4>วันที่: {new Date().toLocaleDateString()}</h4>
        </div>

        {/* เลือกที่อยู่ */}
        <h4 className="mb-3">เลือกที่อยู่</h4>
        {addresses.length > 0 ? (
          addresses.map(address => (
            <div key={address.id_address} className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="address"
                id={`address-${address.id_address}`}
                value={address.id_address}
                checked={selectedAddressId === address.id_address}
                onChange={() => setSelectedAddressId(address.id_address)}
              />
              <label className="form-check-label" htmlFor={`address-${address.id_address}`}>
                {address.address_name} - {address.address_full}, {address.address_district}, {address.address_province}, {address.address_code}
              </label>
            </div>
          ))
        ) : (
          <p>ไม่พบที่อยู่</p>
        )}

        {/* เลือกวิธีชำระเงิน */}
        <h4 className="mb-3">เลือกวิธีชำระเงิน</h4>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="qrcode"
            value="qrcode"
            checked={paymentMethod === 'qrcode'}
            onChange={() => setPaymentMethod('qrcode')}
          />
          <label className="form-check-label" htmlFor="qrcode">
            QR Code
          </label>
        </div>
        {paymentMethod === 'qrcode' && (
          <div className="mb-4 text-center">
            <h5>QR Code</h5>
            <img src={Qrcode} alt="QR Code" className="img-fluid" style={{ width: '200px' }} />
          </div>
        )}

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="bank"
            value="bank"
            checked={paymentMethod === 'bank'}
            onChange={() => setPaymentMethod('bank')}
          />
          <label className="form-check-label" htmlFor="bank">
            เลขที่บัญชี
          </label>
        </div>
        {paymentMethod === 'bank' && (
          <div className="mb-4">
            <h5>รายละเอียดบัญชี</h5>
            <div className="card p-3 shadow-lg border-light">
              <p>ชื่อธนาคาร: {accountBname}</p>
              <p>เลขที่บัญชี: {accountNumber} <button onClick={copyToClipboard} className="btn btn-secondary btn-sm ml-2">คัดลอก</button></p>
              <p>ชื่อเจ้าของบัญชี: {accountUname}</p>
            </div>
          </div>
        )}

        {/* อัปโหลดสลิปการชำระเงิน */}
        <div className="mb-4">
          <h4>อัปโหลดสลิปการชำระเงิน</h4>
          <input type="file" className="form-control" onChange={handleFileChange} />
          {slipImage && (
            <div className="mt-3 text-center">
              <h5>รูปสลิปการชำระเงิน</h5>
              <img src={slipImage} alt="Slip" className="img-fluid" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>

        <button className="btn btn-success w-100" onClick={handleConfirmPayment}>ยืนยันการชำระเงิน</button>
        <button className="btn btn-danger w-100 mt-2">ยกเลิกรายการ</button>
      </div>
    </>
  );
}

export default ShopPayment;
