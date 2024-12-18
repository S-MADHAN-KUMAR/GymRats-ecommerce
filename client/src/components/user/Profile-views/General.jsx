import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../helper/Loader';
import { showToast } from '../../../helper/toast.js';

const General = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currUser, setCurrUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [errors, setErrors] = useState({
    name: '',
    password: '',
    phone: '',
  });

  const fetchCurrUser = async () => {
    const userId = currentUser?.user?._id;
    if (!userId) {
      console.log('No user ID found!');
      return;
    }
    
    try {
      const res = await axios.get(`http://localhost:3000/user/getCurrentUser?id=${userId}`);
      if (res.status === 200) {
        const fetchedUser = res.data.currentUser;
        setCurrUser(fetchedUser);
        setFormData({
          id: fetchedUser._id,
          name: fetchedUser.name,
          email: fetchedUser.email,
          password: fetchedUser.password,
          phone: fetchedUser.phone,
        });
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    fetchCurrUser();
  }, []);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear error message when input is changed
    }));
  };


  const validateForm = () => {
    const { name, password, phone } = formData;
    let isValid = true;
    const newErrors = { name: '', password: '', phone: '' };


    if (!name || name.length < 3 || !/^[a-zA-Z ]+$/.test(name)) {
      newErrors.name = "Name must be at least 3 characters long and contain only alphabets and spaces.";
      isValid = false;
    }
    

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    } else if (password === currUser.password) {
      newErrors.password = "Try a different password!";
      isValid = false;
    }


    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    } else if (phone === currUser.phone) {
      newErrors.phone = "Try a different phone number!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveClick = async () => {

    if (!validateForm()) return;

    const updatedData = {
      id: formData.id,
      name: formData.name,
      password: formData.password,
      phone: formData.phone,
    };

    console.log('Updated Data:', updatedData);

    try {
      const res = await axios.put("http://localhost:3000/user/updateProfile", updatedData);

      if (res.status === 200) {
        showToast(res.data.message, 'light', 'success');
        fetchCurrUser();
        setIsEditable(false); 
      } else {
        console.log(res.data.message); 
        showToast(res.data.message, 'dark', 'error'); 
      }
    } catch (error) {
      if (error.response) {
        console.error('Error updating user profile:', error.response.data);
        showToast(`${error.response.data.message || 'Something went wrong'}`, 'dark', 'error');
      } else {
        console.error('Error:', error.message);
        showToast('Unable to update profile. Please try again.', 'dark', 'error');
      }
    }
  };

  return (
    <div className="p-5 border items-center h-full overflow-hidden font-Roboto flex flex-col justify-around">
      <h1 className="font-audiowide uppercase text-3xl tracking-wider drop-shadow">Profile Setting</h1>
      <div className="form flex flex-col w-2/3 h-[340px] justify-between">
        <input
          className="text-white bg-gray-700 mb-1 p-3 rounded-md"
          type="text"
          name="name"
          value={formData.name}
          readOnly={!isEditable} 
          onChange={handleInputChange}
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}

        <input
          className="text-white bg-gray-700 mb-1 p-3 rounded-md cursor-not-allowed"
          type="email"
          name="email"

          value={formData.email}
          readOnly
        />

        <input
          className="text-white bg-gray-700 mb-1 p-3 rounded-md"
          type="password"
          name="password"
          value={formData.password}
          placeholder={formData.password ? " " : "Create Password !" }
          readOnly={!isEditable}
          onChange={handleInputChange}
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}

        <input
          className="text-white bg-gray-700 mb-1 p-3 rounded-md"
          type="text"
          name="phone"
          placeholder={formData.phone ? " " : "Add phone number !" }
          value={formData.phone}
          readOnly={!isEditable}
          onChange={handleInputChange}
        />
        {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}

        {!isEditable ? (
          <button className="btn w-40 mx-auto" onClick={handleEditClick}>
            Edit
          </button>

        ) : (
        <div className='flex justify-between'>
          <button className="btn w-40 flex items-center justify-center" onClick={handleSaveClick}>
            {loading ? <Loader /> : "Save"}
          </button>
          <button onClick={()=>setIsEditable(false)} className="btn w-40 flex items-center justify-center">Cancel</button>
        </div>
        )}
      </div>
    </div>
  );
};

export default General;
