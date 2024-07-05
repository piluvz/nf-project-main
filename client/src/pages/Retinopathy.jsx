import React, { useState } from 'react';
import '../style/upload.css';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  useDisclosure
} from '@chakra-ui/react'; 

const RetinopathyImageUpload = () => {
  function OverlayOne() {
    return (
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
    );
  }

  function ImageUpload() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(<OverlayOne />);

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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

      const formData = new FormData();
      formData.append('file', file);

      try {
        setLoading(true);
        const response = await axios.post('https://epitet.azurewebsites.net/classify-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        setResult(response.data);
        setLoading(false);
        onOpen();
      } catch (error) {
        console.error('Error:', error);
        alert('Error classifying image.');
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
      setResult(null);
    };

    return (
      <div className="upload-container">
        <a href="/" className="btn-back">&#8592; Back</a>
        <h3 style={{ fontFamily: 'Montserrat, sans-serif', marginBottom: '30px'}}>Диагностика ретинопатии</h3>
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
              <p style={{ fontFamily: 'Montserrat, sans-serif' }}>Используя снимки глазного дна, DiaCare может диагностировать диабетическую ретинопатию, что способствует раннему выявлению и лечению этого заболевания.</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px' }}> 
                Пожалуйста, загрузите снимок глазного дна. Наш ИИ проанализирует изображение и определит степень диабетической ретинопатии.
            </p>
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
            <button onClick={result ? onOpen : handleSubmit} className="btn btn-upload" disabled={loading}>
              {result ? 'Open' : 'Upload'}
            </button>
          </div>
        )}
        <Modal className="modal" isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <div className="container_modal">
              <div className='modal_header'>
                <ModalHeader className='modal_title'>Results:</ModalHeader>
                <ModalCloseButton className='modal_btn' />
              </div>
              <ModalBody className='modal_body'>
                {result ? (
                  <Box>
                    <Text style={{ fontFamily: 'Montserrat, sans-serif', textAlign:'center' }}><strong>{result.label}</strong> </Text>
                    {/* <Text><strong>Score:</strong> {result.score}</Text> */}
                    {/* <Text><strong>Explanation:</strong> {result.explanation}</Text> */}

                    {result.label === "No Diabetic Retinopathy" && (
                      <Text style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', textAlign: 'center' }} > Диабетическая ретинопатия не выявлена. Ваши глаза находятся в хорошем состоянии.</Text>
                    )}
                    {result.label === "Mild Diabetic Retinopathy" && (
                      <Text style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', textAlign: 'center'  }}>Обнаружены начальные признаки диабетической ретинопатии. Рекомендуется наблюдение у врача.</Text>
                    )}
                    {result.label === "Moderate Diabetic Retinopathy" && (
                      <Text style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', textAlign: 'center'  }}> Обнаружены умеренные признаки диабетической ретинопатии. Необходимо медицинское вмешательство.</Text>
                    )}
                    {result.label === "Severe Diabetic Retinopathy" && (
                      <Text style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', textAlign: 'center'  }}> Обнаружены серьёзные признаки диабетической ретинопатии. Срочно обратитесь к врачу.</Text>
                    )}
                    {result.label === "Proliferative Diabetic Retinopathy" && (
                      <Text style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', textAlign: 'center'  }}> Обнаружены признаки пролиферативной диабетической ретинопатии. Требуется немедленное лечение.</Text>
                    )}

                    
                  </Box>
                ) : (
                  <Text>Loading...</Text>
                )}
              </ModalBody>
            </div>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <ImageUpload />
    </div>
  );
};

export default RetinopathyImageUpload;
