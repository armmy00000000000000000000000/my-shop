import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function AddressShop() {
    const [provinces, setProvinces] = useState([]);
    const [amphures, setAmphures] = useState([]);
    const [tambons, setTambons] = useState([]);
    const [selected, setSelected] = useState({
        province_id: undefined,
        amphure_id: undefined,
        tambon_id: undefined,
    });
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        street: '',
    });
    const [addressList, setAddressList] = useState([]);
    const line_token = localStorage.getItem('token');
    const iduser = localStorage.getItem('userid');

    // Fetch provinces
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
            );
            const result = await response.json();
            setProvinces(result);
        };
        fetchData();

        // Fetch existing addresses
        const fetchAddresses = async () => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            fetch(process.env.REACT_APP_API+`/users.php?service=list_address&id_user=${iduser}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status) {
                        setAddressList(result.response);
                    } else {
                        console.error("Failed to fetch address list");
                    }
                })
                .catch(error => console.error("Error fetching address list:", error));
        };
        fetchAddresses();
    }, []);

    const handleSelectChange = (id, value) => {
        if (id === 'province_id') {
            setAmphures([]);
            setTambons([]);
        } else if (id === 'amphure_id') {
            setTambons([]);
        }

        setSelected(prev => ({ ...prev, [id]: value }));

        if (id === 'province_id' && value) {
            const selectedProvince = provinces.find(item => item.id === Number(value));
            if (selectedProvince) {
                setAmphures(selectedProvince.amphure);
            }
        }

        if (id === 'amphure_id' && value) {
            const selectedAmphure = amphures.find(item => item.id === Number(value));
            if (selectedAmphure) {
                setTambons(selectedAmphure.tambon);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("address_name", formData.fullName);
        formdata.append("address_phone", formData.phone);
        formdata.append("address_full", formData.address);
        formdata.append("address_road", formData.street || "-");

        const selectedProvince = provinces.find(item => item.id === Number(selected.province_id));
        const selectedAmphure = amphures.find(item => item.id === Number(selected.amphure_id));
        const selectedTambon = tambons.find(item => item.id === Number(selected.tambon_id));
        
        formdata.append("address_province", selectedProvince?.name_th || "");
        formdata.append("address_district", selectedAmphure?.name_th || "");
        formdata.append("address_subdistrict", selectedTambon?.name_th || "");
        formdata.append("address_code", selectedTambon?.zip_code || "");
        formdata.append("id_user", iduser);

        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        fetch(process.env.REACT_APP_API+"/users.php?service=add_address", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    Swal.fire("สำเร็จ", "เพิ่มที่อยู่เรียบร้อยแล้ว", "success");
                    setAddressList(prev => [...prev, result.response]);
                } else {
                    Swal.fire("ผิดพลาด", "ไม่สามารถเพิ่มที่อยู่ได้", "error");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้", "error");
            });
    };

    return (
        <div className="container mt-2">
            <h2 className="mb-4">กรอกที่อยู่การจัดส่ง</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">ชื่อ-นามสกุล</label>
                    <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">ที่อยู่</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">ถนน</label>
                    <input
                        type="text"
                        className="form-control"
                        name="street"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="province_id">จังหวัด</label>
                    <select
                        value={selected.province_id || ''}
                        onChange={(e) => handleSelectChange('province_id', e.target.value)}
                        className="form-select"
                    >
                        <option label="เลือก..." />
                        {provinces.map(item => (
                            <option key={item.id} value={item.id}>{`${item.name_th} - ${item.name_en}`}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="amphure_id">อำเภอ</label>
                    <select
                        value={selected.amphure_id || ''}
                        onChange={(e) => handleSelectChange('amphure_id', e.target.value)}
                        className="form-select"
                    >
                        <option label="เลือก..." />
                        {amphures.map(item => (
                            <option key={item.id} value={item.id}>{`${item.name_th} - ${item.name_en}`}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="tambon_id">ตำบล</label>
                    <select
                        value={selected.tambon_id || ''}
                        onChange={(e) => setSelected(prev => ({ ...prev, tambon_id: e.target.value }))}
                        className="form-select"
                    >
                        <option label="เลือก..." />
                        {tambons.map(item => (
                            <option key={item.id} value={item.id}>{`${item.name_th} - ${item.name_en}`}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">รหัสไปรษณีย์</label>
                    <input
                        type="text"
                        className="form-control"
                        name="postalCode"
                        value={tambons.length > 0 ? tambons[0]?.zip_code || '' : ''}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">ยืนยัน</button>
            </form>

            <h3 className="mt-5">รายการที่อยู่ที่บันทึกไว้</h3>
            <div className="row">
                {addressList.map((address) => (
                    <div className="col-md-4 mb-4" key={address.id_address}>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{address.address_name}</h5>
                                <p className="card-text"><strong>โทรศัพท์:</strong> {address.address_phon}</p>
                                <p className="card-text"><strong>ที่อยู่:</strong> {address.address_full}</p>
                                <p className="card-text"><strong>ถนน:</strong> {address.address_road}</p>
                                <p className="card-text"><strong>ตำบล:</strong> {address.address_subdistrict}, <strong>อำเภอ:</strong> {address.address_district}, <strong>จังหวัด:</strong> {address.address_province}</p>
                                <p className="card-text"><strong>รหัสไปรษณีย์:</strong> {address.address_code}</p>
                                <p className="text-muted" style={{ fontSize: '0.9em' }}><strong>บันทึกเมื่อ:</strong> {new Date(address.date_time).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
