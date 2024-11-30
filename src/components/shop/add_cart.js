


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import re from '../img/004.gif'; // นำเข้ารูปภาพ
export default function Addcar() {
    const [currentImage, setCurrentImage] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [selectedSize, setSelectedSize] = useState('') || null;
    const [SizeName, setSizeName] = useState('') || null;
    const [idstore, setidstore] = useState('');
    const [idproduct, setidproduct] = useState('');
    const [rating, setRating] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sizes, setSizes] = useState([]);
    const [product, setProduct] = useState(null); // สถานะสำหรับเก็บข้อมูลผลิตภัณฑ์
    const [images, setImages] = useState([]); // สถานะสำหรับเก็บข้อมูลภาพผลิตภัณฑ์
    const location = useLocation();
    const { state } = location;
    const line_token = localStorage.getItem('token');
    const iduser = localStorage.getItem('userid');

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('countaddress') === '0') {
            Swal.fire({
                title: 'กรุณาเพิ่มที่อยู่จัดส่งก่อนทำรายการ',
                icon: 'warning',
                confirmButtonText: 'ยืนยัน'
            }).then((result) => {
                if (result.isConfirmed) {
                    // ถ้าผู้ใช้กดปุ่ม "ยืนยัน" ให้ไปที่หน้า /Listshop
                    window.location.href = '/Shop_partner/shop/Listshop';
                }
            });
        }
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`${process.env.REACT_APP_API}/users.php?service=product_details&id_product=${state.id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status && data.response) {
                    setProduct(data.response.product);
                    setImages(data.response.preview_images);
                    setCurrentImage(data.response.product.preview_product);
                    setidstore(data.response.product.id_store);
                    setidproduct(data.response.product.id_product);
                    if (data.response.product.option_product === "yes") {
                        setSizes(data.response.sizes); // เก็บข้อมูลขนาดเมื่อ option_product เป็น "yes"
                    }
                }
            })
            .catch((error) => console.error(error));
    }, []); // ทำงานเมื่อคอมโพเนนต์แรกเรนเดอร์

    const handleImageChange = (newImage) => {
        setCurrentImage(newImage);
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 0));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Product:", product);
        console.log("Quantity:", quantity);
        console.log("Selected Size:", selectedSize);
        console.log("Rating:", rating);
    };

    const handleRating = (rate) => {
        setRating(rate);
        const formdata = new FormData();
        formdata.append("id_product", state.id);
        formdata.append("rating", rate);
        formdata.append("user_id", "1");

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch(process.env.REACT_APP_API+"/users.php?service=list_product", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === true) {
                    Swal.fire("ขอบคุณที่ให้คะแนนรีวิว", "", "success");
                } else {
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกคะแนนรีวิวได้", "error");
                }
            })
            .catch((error) => {
                console.error(error);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
            });
    };

    const handleNext = () => {
        const nextIndex = (currentSlide + 1) % images.length;
        setCurrentSlide(nextIndex);
        handleImageChange(images[nextIndex].img_preview);
    };

    const handlePrev = () => {
        const prevIndex = (currentSlide - 1 + images.length) % images.length;
        setCurrentSlide(prevIndex);
        handleImageChange(images[prevIndex].img_preview);
    };

    const handleSizeChange = (id, size) => {
        setSelectedSize(id); // เก็บ ID ของขนาดที่เลือกไว้
        setSizeName(size);   // เก็บชื่อของขนาดที่เลือกไว้
    };

    const addOrder = (product_id, store_id, quantity, size, price_product, id_user, line_token, product_name, img) => {
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
                // ถ้าผู้ใช้ยืนยัน
                const requestOptions = {
                    method: "POST",
                    body: formdata,
                    redirect: "follow"
                };

                fetch(process.env.REACT_APP_API+"/users.php?service=order", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.status === true) {
                            // ถ้า API ส่งผลลัพธ์ที่ status เป็น true
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
                            // แจ้งเตือนถ้าการสั่งซื้อไม่สำเร็จ
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


    const shopping_cart = (product_id, store_id, quantity, size, price_product, id_user, product_name) => {
        const total = quantity * price_product;
        const formdata = new FormData();
        formdata.append("id_user", id_user);
        formdata.append("id_product", product_id || '');
        formdata.append("name_product", product_name || '');
        formdata.append("quantity_product", quantity || 1);
        formdata.append("unit_price", price_product || price_product);
        formdata.append("total_price", total || price_product);
        formdata.append("size", size || 'null');
        formdata.append("id_store", store_id || '');
        formdata.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch(process.env.REACT_APP_API+"/users.php?service=shopping_cart", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                if (result.status === true) {
                    Swal.fire(result.message, "", "success");
                } else {
                    Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มตระกล้าได้", "error");
                }
            })
            .catch((error) => console.error(error));
    }


    // ตรวจสอบว่ามีข้อมูลผลิตภัณฑ์หรือไม่
    if (!product) {
        return (
            <div className="loading">
                <img width={100} src={re} alt="Loading..." />
                Loading...
            </div>
        );
    }

    return (
        <div>
            <section className="bg-light">

                <div className="container pb-5">
                    <div className="row">
                        <div className="col-lg-5 mt-5">
                            <div className="card mb-3">
                                <img
                                    className="card-img img-fluid"
                                    src={`${process.env.REACT_APP_API}/${currentImage}`}
                                    alt="Product main view"
                                    id="product-detail"
                                />
                            </div>
                            <div className="row">
                                <div className="col-1 align-self-center">
                                    {/* <button onClick={handlePrev} className="btn btn-link">
                                        <i className="text-dark fas fa-chevron-left"></i>
                                        <span className="sr-only">Previous</span>
                                    </button> */}
                                </div>
                                <div id="multi-item-example" className="col-10 carousel slide carousel-multi-item" data-bs-ride="carousel">
                                    <div className="carousel-inner product-links-wap" role="listbox">
                                        <div className="carousel-item active">
                                            <div className="row mt-3">
                                                {images.map((image) => (
                                                    <div className="col-4" key={image.id}>
                                                        <a href="#" onClick={() => handleImageChange(image.img_preview)}>
                                                            <img className="card-img img-fluid" src={`${process.env.REACT_APP_API}/${image.img_preview}`} alt={`Product Image ${image.id}`} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1 align-self-center">
                                    {/* <button onClick={handleNext} className="btn btn-link">
                                        <i className="text-dark fas fa-chevron-right"></i>
                                        <span className="sr-only">Next</span>
                                    </button> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 mt-5">
                            <div className="card">
                                <div className="card-body">
                                    {product && ( // เช็คว่า product มีข้อมูลหรือไม่
                                        <>
                                            <h1 className="h2">{product.name_product}</h1>
                                            <p className="h3 py-2">ราคา {product.price_product} บาท</p>

                                            {/* Rating */}
                                            <div className="py-2">
                                                <span>ให้คะแนน     </span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i
                                                        key={star}
                                                        className={`fa fa-star ${star <= rating ? 'text-warning' : 'text-secondary'}`}
                                                        onClick={() => handleRating(star)}
                                                        style={{ cursor: 'pointer' }}
                                                    ></i>
                                                ))}
                                                <span className="list-inline-item text-dark">Rating {rating} / 5</span>
                                            </div>

                                            <ul className="list-inline">
                                                <li className="list-inline-item">
                                                    <h6>ร้านค้า:</h6>
                                                </li>
                                                <li className="list-inline-item">
                                                    <p className="text-muted"><strong>{product.store_name}</strong></p>
                                                </li>
                                            </ul>

                                            <h6>Description:</h6>
                                            <p>{product.product_detall}</p>
                                            {/* <p>ราคารวม: {quantity * product.price_product} </p>
                                            <p>จำนวน: {quantity} </p>
                                            <p>size: {selectedSize} </p>
                                            <p>id_store: {idstore} </p>
                                            <p>id_product: {idproduct} </p>
                                            <p>name size: {SizeName} </p> */}

                                            <form onSubmit={handleFormSubmit}>
                                                <input type="hidden" name="product-title" value={product.name_product} />
                                                <div className="row">
                                                    {/* Category Select */}
                                                    <div>
                                                        {/* <div className="form-group">
                                                            <label htmlFor="category-select">เลือกประเภท:</label>
                                                            <select
                                                                id="category-select"
                                                                onChange={(e) => setCategory(e.target.value)}
                                                                value={category}
                                                                className="form-control"
                                                            >
                                                                <option value="adult">ผู้ใหญ่</option>
                                                                <option value="child">เด็ก</option>
                                                            </select>
                                                        </div> */}

                                                        {/* Size Selection */}
                                                        {product.option_product === "yes" && (
                                                            <div className="form-group">
                                                                <label htmlFor="size-select">Size:</label>
                                                                <select
                                                                    id="size-select"
                                                                    className="form-control"
                                                                    value={selectedSize} // กำหนดค่า value ให้ตรงกับ selectedSize
                                                                    onChange={(e) => {
                                                                        const selectedOption = sizes.find(size => size.id === parseInt(e.target.value));
                                                                        if (selectedOption) {
                                                                            handleSizeChange(selectedOption.id, selectedOption.size);
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="">-- เลือกขนาด --</option>
                                                                    {sizes.map((size) => (
                                                                        <option key={size.id} value={size.id}>{size.size}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}

                                                    </div>
                                                    <div className="col-auto">
                                                        <ul className="list-inline pb-3">
                                                            <li className="list-inline-item text-right">Quantity
                                                                <input type="hidden" name="product-quantity" id="product-quantity" value={quantity} />
                                                            </li>
                                                            <li className="list-inline-item"><span className="btn btn-success" onClick={handleDecrement}>-</span></li>
                                                            <li className="list-inline-item"><span className="badge bg-secondary text-white h1" id="var-value">{quantity}</span></li>
                                                            <li className="list-inline-item"><span className="btn btn-success" onClick={handleIncrement}>+</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="row pb-3">
                                                    <div className="col d-grid">
                                                        <button
                                                            onClick={() => {
                                                                addOrder(idproduct, idstore, quantity, selectedSize, product.price_product, iduser, line_token, product.name_product, `${process.env.REACT_APP_API}/${currentImage}`);
                                                            }}

                                                            className="btn btn-success btn-lg"

                                                        >
                                                            สั่งซื้อ
                                                        </button>

                                                    </div>
                                                    <div className="col d-grid">
                                                        <button      onClick={() => {
                                                                shopping_cart(idproduct, idstore, quantity, selectedSize, product.price_product, iduser, product.name_product);
                                                            }} type="submit" className="btn btn-success btn-lg" name="submit" value="addtocart">เพิ่มในรถเข็น</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col d-grid">
                    <Link to="/Listshop" className="btn btn-success btn-lg">กลับไปหน้าหลัก</Link>
                </div>
            </section>
        </div>
    );
}













// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// export default function Addcar() {
//     const [currentImage, setCurrentImage] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [selectedSize, setSelectedSize] = useState('');
//     const [rating, setRating] = useState(0);
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [sizes, setSizes] = useState([]);
//     const [product, setProduct] = useState(null); // สถานะสำหรับเก็บข้อมูลผลิตภัณฑ์
//     const [images, setImages] = useState([]); // สถานะสำหรับเก็บข้อมูลภาพผลิตภัณฑ์

//     useEffect(() => {
//         const requestOptions = {
//             method: "GET",
//             redirect: "follow"
//         };

//         fetch(process.env.REACT_APP_API+"/users.php?service=product_details&id_product=3", requestOptions)
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.status && data.response) {
//                     setProduct(data.response.product);
//                     setImages(data.response.preview_images);
//                     setCurrentImage(data.response.product.preview_product);
//                     if (data.response.product.option_product === "yes") {
//                         setSizes(data.response.sizes); // เก็บข้อมูลขนาดเมื่อ option_product เป็น "yes"
//                     }
//                 }
//             })
//             .catch((error) => console.error(error));
//     }, []); // ทำงานเมื่อคอมโพเนนต์แรกเรนเดอร์

//     const handleImageChange = (newImage) => {
//         setCurrentImage(newImage);
//     };

//     const handleIncrement = () => {
//         setQuantity(prevQuantity => prevQuantity + 1);
//     };

//     const handleDecrement = () => {
//         setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission logic here
//         console.log("Product:", product);
//         console.log("Quantity:", quantity);
//         console.log("Selected Size:", selectedSize);
//         console.log("Rating:", rating);
//     };

//     const handleRating = (rate) => {
//         setRating(rate);
//     };

//     const handleNext = () => {
//         const nextIndex = (currentSlide + 1) % images.length;
//         setCurrentSlide(nextIndex);
//         handleImageChange(images[nextIndex].img_preview);
//     };

//     const handlePrev = () => {
//         const prevIndex = (currentSlide - 1 + images.length) % images.length;
//         setCurrentSlide(prevIndex);
//         handleImageChange(images[prevIndex].img_preview);
//     };

//     // ตรวจสอบว่ามีข้อมูลผลิตภัณฑ์หรือไม่
//     if (!product) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <h1>{product.name_product}</h1>
//             <img src={`${process.env.REACT_APP_API}/${currentImage}`} alt="Current Product" className="img-fluid" />
//             <div className="row mt-3">
//                 {images.map((image) => (
//                     <div className="col-4" key={image.id}>
//                         <a href="#" onClick={() => handleImageChange(image.img_preview)}>
//                             <img className="card-img img-fluid" src={`${process.env.REACT_APP_API}/${image.img_preview}`} alt={`Product Image ${image.id}`} />
//                         </a>
//                     </div>
//                 ))}
//             </div>
//             <button className="btn btn-primary mt-3" onClick={handlePrev}>Previous</button>
//             <button className="btn btn-primary mt-3" onClick={handleNext}>Next</button>
//             {sizes.length > 0 && (
//                 <div className="mt-3">
//                     <label htmlFor="size-select">Select Size:</label>
//                     <select id="size-select" onChange={(e) => setSelectedSize(e.target.value)}>
//                         <option value="">--Select Size--</option>
//                         {sizes.map(size => (
//                             <option key={size.id} value={size.size}>{size.size}</option>
//                         ))}
//                     </select>
//                 </div>
//             )}
//             <div className="mt-3">
//                 <button className="btn btn-secondary" onClick={handleDecrement}>-</button>
//                 <span className="mx-2">{quantity}</span>
//                 <button className="btn btn-secondary" onClick={handleIncrement}>+</button>
//             </div>
//             <form onSubmit={handleFormSubmit} className="mt-3">
//                 <button type="submit" className="btn btn-success">Submit</button>
//             </form>
//         </div>
//     );
// }
