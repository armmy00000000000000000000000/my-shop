import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { SHOP_CONNEXT } from './config';
import liff from '@line/liff';
import Swal from 'sweetalert2';
import re from '../img/004.gif'; // นำเข้ารูปภาพ

function Shop_connext() {
  const queryParameters = new URLSearchParams(window.location.search);
  const iduser = queryParameters.get("iduser");
  const token = queryParameters.get("token");
  const name = queryParameters.get("name");
  const img = queryParameters.get("img");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();




  useEffect(() => {

    liff.init({ liffId: `${SHOP_CONNEXT}`,withLoginOnExternalBrowser: true })
    .then(() => {
      // handleLogin();
    })
    const id = localStorage.getItem('userid');
    // liff.init({ liffId: '2006408059-Jx6goXXg' });
    if (!id) {
    } else {
      // ถ้า token และ id ไม่เป็นค่าว่าง ตั้งค่า isConnected เป็น true
      setIsConnected(true);
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const profile = await liff.getProfile();
      console.log(profile);
      Slogin("", "line", profile.userId, profile.displayName, profile.userId);
      localStorage.setItem('profile', profile.pictureUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const Slogin = (email, provider, provider_id, name, token) => {
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("token", token);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    fetch("https://addpaycrypto.com//Shop_partner/service/users.php?service=user_login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === true) {
          localStorage.setItem('email', result.response.email);
          localStorage.setItem('userid', result.response.id_user);
          localStorage.setItem('name', result.response.name);
          localStorage.setItem('token', result.response.token);

          Swal.fire({
            title: 'เชื่อมต่อสำเร็จ!',
            text: 'คุณสามารถใช้งานต่อได้ที่ห้องแชท',
            icon: 'success',
            confirmButtonText: 'ดำเนินการต่อ',
          }).then(() => {
            setIsConnected(true); // ตั้งค่าสถานะเชื่อมต่อเป็น true
            navigate('/');
          });
        } else {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'กรุณาลองเชื่อมต่อใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'เชื่อมต่อใหม่',
          }).then(() => {
            navigate('/Shopconnext');
          });
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDisconnect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('profile');
    setIsConnected(false); // ตั้งค่าสถานะเป็นไม่ได้เชื่อมต่อ
    Swal.fire({
      title: 'เลิกเชื่อมต่อสำเร็จ',
      text: 'คุณได้เลิกเชื่อมต่อเรียบร้อยแล้ว',
      icon: 'info',
      confirmButtonText: 'ตกลง',
    }).then(() => {
      navigate('/Shopconnext');
    });
  };

  return (
    <div>
      <section className="vh-90">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-4">
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                  <div className="mt-3 mb-4">
                    <img
                      src={re}
                      className="rounded-circle img-fluid"
                      style={{ width: '100px' }}
                      alt="User Avatar"
                    />
                  </div>
                  <h4 className="mb-2">{name || "เชื่อมต่อกับเรา"}</h4>
                  <p className="text-muted mb-4">เชื่อมต่อกับเรา <span className="mx-2">|</span> <a href="#!">Zoo e-Ticket By @pay</a></p>

                  {isConnected ? (
                    <>
                    
                    <Link to="/"
                      type="button"
                    
                      className="btn btn-success  btn-rounded btn-lg"
                    >
                      MY SHOP
                    </Link>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="btn btn-danger btn-rounded btn-lg"
                    >
                      เลิกเชื่อมต่อ
                    </button>
                    </>
               
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="btn btn-primary btn-rounded btn-lg"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop_connext;
