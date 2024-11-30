import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const line_token = localStorage.getItem('token');
  const iduser = localStorage.getItem('userid');

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(process.env.REACT_APP_API+"/users.php?service=list_cart&id_user="+iduser, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          const items = result.response.map(item => ({
            id: item.id_product,
            id_cart: item.id_cart,
            id_store: item.id_store,
            name: item.name_product,
            quantity: item.quantity_product,
            size: item.size_info.size,
            selectedSize: item.size,
            unit_price: item.unit_price,
            price: parseFloat(item.unit_price),
            image: `https://addpaycrypto.com//Shop_partner/service/${item.preview_product}`
          }));
          setCartItems(items);
        }
      })
      .catch((error) => console.error("Error fetching cart items:", error));
  }, []);

  const updateQuantity = (id, delta) => {
    console.log(id)
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item.id_cart === id) {
          console.log(item.id )
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const addOrder = (product_id, store_id, quantity, size, SizeName, price_product, id_user, line_token, product_name, img) => {
    const formdata = new FormData();
    const total = quantity * price_product;

    formdata.append("product_id", product_id);
    formdata.append("store_id", store_id);
    formdata.append("quantity", quantity);
    formdata.append("size", size);
    formdata.append("total_price", total);
    formdata.append("buyer_id", id_user);
    formdata.append("shipping_address", "");
    formdata.append("payment_method", "");
    formdata.append("line_token", line_token);
    formdata.append("slip", "");

    Swal.fire({
      title: 'ยืนยันการสั่งซื้อ?',
      text: `จำนวน ${quantity} ชิ้น, รวมเป็นเงิน ${total} บาท`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };

        fetch(process.env.REACT_APP_API+"/users.php?service=order", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status === true) {
              Swal.fire('เพิ่มคำสั่งซื้อ กรุณาชำระงิน', 'หมายเลขคำสั่งซื้อของคุณคือ ' + result.response.order_number, 'success');
              navigate('/ShopPayment', {
                state: {
                  idstore: store_id,
                  order_number: result.response.order_number,
                  total_price: total,
                  quantity: quantity,
                  unit: price_product,
                  product_name: product_name,
                  size: SizeName,
                  img: img
                }
              });
            } else {
              Swal.fire('เกิดข้อผิดพลาด', 'การสั่งซื้อไม่สำเร็จ กรุณาลองใหม่', 'error');
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('เกิดข้อผิดพลาด', 'การสั่งซื้อไม่สำเร็จ กรุณาลองใหม่', 'error');
          });
      }
    });
  };

  return (
    <div>
      <section className="h-100">
        <div className="container h-100 py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-10">
              <h3 className="fw-normal mb-4">ตะกร้าสินค้า</h3>

              {cartItems.map((item) => (
                <div className="card rounded-3 mb-4" key={item.id}>
                  <div className="card-body p-4">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-md-2 col-lg-2 col-xl-2">
                        <img
                          src={item.image}
                          className="img-fluid rounded-3"
                          alt={item.name}
                        />
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-3">
                        <p className="lead fw-normal mb-2">{item.name}</p>
                        <p>
                          <span className="text-muted">ขนาด: </span>{item.size}
                        </p>
                      </div>
                      <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                        <button className="btn btn-link px-2" onClick={() => updateQuantity(item.id_cart, -1)}>
                          <i className="fas fa-minus"></i>
                        </button>

                        <input
                          min="0"
                          name="quantity"
                          value={item.quantity}
                          type="number"
                          className="form-control form-control-sm"
                          readOnly
                        />

                        <button className="btn btn-link px-2" onClick={() => updateQuantity(item.id_cart, 1)}>
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                        <h5 className="mb-0">{(item.price * item.quantity).toFixed(2)} บาท</h5>
                      </div>
                      <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                        {/* <a href="#!" className="text-danger">
                          <i className="fas fa-trash fa-lg"></i>
                        </a> */}
                      </div>
                    </div>
                    <button onClick={() => {
                      addOrder(item.id, item.id_store, item.quantity, item.selectedSize,item.size, item.price, iduser, line_token, item.name, item.image);
                    }} type="button" className="btn btn-warning btn-block btn-lg mt-5">ชำระเงิน</button>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
