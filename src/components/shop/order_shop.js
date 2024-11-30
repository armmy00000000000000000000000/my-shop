import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function OrderShop() {
  const [orders, setOrders] = useState([]);
  const line_token = localStorage.getItem('token');
  const iduser = localStorage.getItem('userid');
  useEffect(() => {
    fetch(process.env.REACT_APP_API+'/users.php?service=list_order&id_user='+iduser)
      .then(response => response.json())
      .then(data => {
        if (data.status) {
          setOrders(data.response);
        }
      })
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  return (
    <div>
      <div className="container mt-5">
        <h2 className="mb-4">รายการคำสั่งซื้อ</h2>
        <div className="row">
          {orders.map((orderData, index) => {
            const order = orderData.order;
            const size = orderData.size ? orderData.size.size : 'ไม่ระบุ';

            // ตรวจสอบสถานะการจัดเตรียม
            let preparationStatus;
            let preparationBadge;

            switch (order.preparation_status) {
              case 'awaiting_payment_verification':
                preparationStatus = 'รอตรวจสอบ';
                preparationBadge = 'bg-warning text-dark';
                break;
              case 'preparing':
                preparationStatus = 'กำลังเตรียมสินค้า';
                preparationBadge = 'bg-info ';
                break;
              case 'shipped':
                preparationStatus = 'จัดส่งแล้ว';
                preparationBadge = 'bg-success';
                break;
              default:
                preparationStatus = 'สถานะไม่ระบุ';
                preparationBadge = 'bg-secondary text-dark';
                break;
            }

            // ตรวจสอบสถานะการชำระเงิน
            let paymentMessage;
            if (order.payment_status === 'pending') {

              if (order.slip === null) {
                paymentMessage = (
                  <p className="card-text text-warning">
                    กรุณาอัพโหลดสลิป,  <Link
                      key={order.order_id}
                      to="/ShopPayment"
                      state={{
                        idstore: order.store_id,
                        order_number: order.order_number,
                        total_price: order.total_price,
                        quantity: order.quantity,
                        unit: order.price_product,
                        product_name: order.name_product,
                        size: size,
                        img: `${process.env.REACT_APP_API}/${order.preview_product}`
                      }} className="btn btn-primary" >กดส่งสลิป</Link>
                  </p>
                );
              } else {
                paymentMessage = <p className="card-text text-danger">สถานะการชำระเงิน: รอตรวจสอบการชำระ</p>;
              }
            } else if (order.payment_status === 'approved') {
              if (order.slip === null) {
                paymentMessage = (
                  <p className="card-text text-warning">
                    กรุณาอัพโหลดสลิป,           <Link
                      key={order.order_id}
                      to="/ShopPayment"
                      state={{
                        idstore: order.store_id,
                        order_number: order.order_number,
                        total_price: order.total_price,
                        quantity: order.quantity,
                        unit: order.price_product,
                        product_name: order.name_product,
                        size: size,
                        img: `${process.env.REACT_APP_API}/${order.preview_product}`
                      }} className="btn btn-primary" >กดส่งสลิป</Link>
                  </p>
                );
              } else {
                paymentMessage = (
                  <p className="card-text">
                    สลิป: <a href={`${process.env.REACT_APP_API}/${order.slip}`} target="_blank" rel="noopener noreferrer">ดูสลิป</a>
                  </p>
                );
              }
            } else if (order.payment_status === 'cancel') {
              paymentMessage = <p className="card-text text-danger">สถานะการชำระเงิน: ยกเลิก</p>;
            }

            return (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">คำสั่งซื้อ: {order.order_number}</h5>
                    <p className="card-text">เลขที่ติดตามพัสดุ: {order.tracking_number || 'ยังไม่ได้ระบุ'}</p>
                    <p className="card-text">จัดส่ง: {order.shipping_provider || 'ยังไม่ได้ระบุ'}</p>
                    <p className="card-text">วันที่สั่งซื้อ: {new Date(order.order_date).toLocaleDateString('th-TH')}</p>
                    <p className="card-text">สถานะการเตรียมสินค้า: <span className={`badge ${preparationBadge}`}>{preparationStatus}</span></p>
                    <img src={`${process.env.REACT_APP_API}/${order.preview_product}`} alt={order.name_product} className="img-fluid mb-2" style={{ height: '150px' }} />
                    <p className="card-text">ชื่อสินค้า: {order.name_product}</p>
                    <p className="card-text">ขนาดสินค้า: {size}</p>
                    <p className="card-text">จำนวนสินค้า: {order.quantity}</p>
                    <p className="card-text">ชื่อร้านค้า: {order.store_name}</p>
                    <p className="card-text">จำนวนเงินรวมที่ชำระ: ฿{order.total_price}</p>
                    {paymentMessage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OrderShop;
