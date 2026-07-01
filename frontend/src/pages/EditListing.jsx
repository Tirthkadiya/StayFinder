
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000";

const EditListing = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

  const categories = [
    "Trending", "Rooms", "Iconic Cities", "Castles", 
    "Mountain Views", "Camping", "Amazing Pools", 
    "Farms", "Arctic", "Boats",
  ];

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_URL}/listings/${id}`);
        const listing = res.data.listing || res.data;

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          price: listing.price || "",
          country: listing.country || "",
          location: listing.location || "",
          category: listing.category || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    
    
    data.append("listing[title]", formData.title);
    data.append("listing[description]", formData.description);
    data.append("listing[price]", formData.price);
    data.append("listing[location]", formData.location);
    data.append("listing[country]", formData.country);
    data.append("listing[category]", formData.category);

    if (image) {
      data.append("image", image); // multer looks for this specific key
    }

    try {
      await axios.put(`${API_URL}/listings/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      navigate("/listings", {state: { success: "Listing updated successfully!" }});
    } catch (err) {
      console.error("Listing updates failed:", err.response?.data);
    }
  };

  if (loading) {
    return <div className="container mt-5"><h4>Loading...</h4></div>;
  }

  return (
    <div className="page-bg">
      <div className="container mt-4 mb-5">
        <div className="form-container">
          <h3 className="mb-4">Edit Listing</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><b>Title</b></label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Description</b></label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required ></textarea>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label"><b>Price</b></label>
                <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
              </div>

              <div className="col-md-8 mb-3">
                <label className="form-label"><b>Country</b></label>
                <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Location</b></label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Category</b></label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange} required >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label"><b>Upload New Image</b></label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              <small className="text-muted d-block mt-1">Leave blank to keep the current image.</small>
            </div>

            <button type="submit" className="btn btn-success w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;