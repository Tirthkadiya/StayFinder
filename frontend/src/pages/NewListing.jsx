
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const NewListing = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    country: "",
    location: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  const categories = [
    "Trending", "Rooms", "Iconic Cities", "Castles", 
    "Mountain Views", "Camping", "Amazing Pools", 
    "Farms", "Arctic", "Boats",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(`listing[${key}]`, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }
      
      await axios.post(`${API_URL}/listings`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true 
      });

      
      navigate("/listings", { 
        state: { success: "New listing created successfully!" } 
      });

    } catch (err) {
      console.error("Error creating listing:", err);
      
      navigate("/listings/new", { 
        state: { error: "Failed to create listing. Please try again." } 
      });
    }
  };

  return (
    <div className="page-bg">
      <div className="container mt-4 mb-5">
        <div className="form-container">
          <h3 className="mb-4">Create New Listing</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><b>Title</b></label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Description</b></label>
              <textarea name="description" rows="4" className="form-control" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Upload Image</b></label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Category</b></label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label"><b>Price</b></label>
                <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} min="0" required />
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label"><b>Country</b></label>
                <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label"><b>Location</b></label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-success w-100">Add Listing</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewListing;