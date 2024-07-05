import React, { useState } from 'react';
import axios from 'axios';
import '../style/upload.css';
import { TailSpin } from 'react-loader-spinner';
import { Box, Text } from '@chakra-ui/react';

const FoodScannerImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [foodDescription, setFoodDescription] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload an image.');
      return;
    }

    if (!foodDescription.trim()) {
      alert('Please provide a description of the food.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', foodDescription);

      // Upload image and description to server
      const uploadResponse = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { photoUrl, message } = uploadResponse.data;
      setResponseMessage(`Analysis: ${message}`);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing request.');
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setImagePreview(URL.createObjectURL(droppedFile));
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  return (
    <div className="upload-container">
      <h3 style={{ fontFamily: 'Montserrat, sans-serif', marginBottom: '30px'}}>Диабетический сканер пищи</h3>
      <a href="/" className="btn-back">&#8592; Back</a>
      <div
        className={`upload-box ${imagePreview || loading ? 'with-image' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="loader-container">
            <TailSpin color="gray" height={80} width={80} />
          </div>
        ) : imagePreview ? (
          <img src={imagePreview} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="upload-prompt">
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px'}}>Загрузите изображение блюда, и наш искусственный интеллект определит, подходит ли оно для диабетиков и в каком количестве его можно употреблять.</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif',  fontSize: '15px' }}> Наша передовая технология анализа изображений продуктов питания поможет вам сделать правильный выбор и следить за своим здоровьем. Просто сделайте фото вашего блюда и получите моментальный результат!</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="file-upload"
            />
            <label style={{ fontFamily: 'Montserrat, sans-serif' }} htmlFor="file-upload" className="custom-file-upload">
              Выберите файл
            </label>
          </div>
        )}
      </div>
      {file && (
        <div className="actions">
          <button onClick={removeImage} className="btn btn-remove">Remove</button>
          <input
            type="text"
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            placeholder="Введите описание пищи..."
            className="food-description-input"
          />
          <button onClick={handleSubmit} className="btn btn-upload" disabled={loading}>Upload</button>
        </div>
      )}
      {responseMessage && (
        <div className="response-message">
          <Text style={{ fontFamily: 'Montserrat, sans-serif' }}>{responseMessage}</Text>
        </div>
      )}
    </div>
  );
};

export default FoodScannerImageUpload;

