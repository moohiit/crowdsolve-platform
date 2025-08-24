import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProblem, setError, clearError, startLoading } from '../../store/slices/problemSlice';

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.problems);
  const { isAuthenticated } = useSelector(state => state.auth);
  if (!isAuthenticated) {
    navigate('/login', { state: { from: { pathname: '/create-problem' } } });
    return null;
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('location', formData.location);
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch(addProblem(data.problem));
        navigate(`/problems/${data.problem._id}`);
      } else {
        dispatch(setError(data.message));
      }
    } catch (error) {
      dispatch(setError('Failed to create problem. Please try again.'));
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-16">
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Report a Problem</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Problem Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="What problem are you reporting?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="Where is this problem located?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="form-input"
              placeholder="Please describe the problem in detail..."
              required
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-3">
              Image (Optional)
            </label>
            <div className="mt-3 flex items-center space-x-4">
              <label className="cursor-pointer">
                <span className="btn-secondary">Choose Image</span>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {formData.image && (
                <span className="text-sm text-gray-400">{formData.image.name}</span>
              )}
            </div>
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Image Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-w-xs rounded-lg border border-dark-600"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/problems')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-save disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Report Problem'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblem;