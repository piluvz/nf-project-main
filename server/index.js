const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3001;

// Configure AWS
const bucketName = process.env.AWS_BUCKET_NAME;

if (!bucketName) {
  console.error("AWS_BUCKET_NAME is not set in environment variables.");
  process.exit(1);
}

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Enable CORS
app.use(cors());

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Handle image upload and process with OpenAI
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const description = req.body.description;

    if (!file) {
      console.error('No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }

    const photoData = file.buffer;
    const uniqueFilename = `${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: `images/${uniqueFilename}`,
      Body: photoData,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    const photoUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/images/${uniqueFilename}`;
    console.log('Photo URL:', photoUrl);

    const prompt = `Ты врач эндокринолог-нутрициолог высшей категории. Я - пациент с сахарным диабетом и мне нужно строго соблюдать правила и ограничения в диете при сахарном диабете, нельзя повышать сахар в крови. Определи, подходит ли мне эта пища или продукт при диабете: ${description}. Вот изображение: ${photoUrl} Если подходит, есть ли ограничения в порции? Расчитай рекомендуемую порцию. Дай очень краткий, но информативный ответ, без воды пожалуйста.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', 
        messages: [
          {
            role: 'system',
            content: 'You are a highly experienced endocrinologist specializing in diabetes treatment and prevention.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.5,
      }),
      });

    if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response data:', errorResponse);
        return res.status(500).json({ status: 'error', message: errorResponse });
    }

    const responseData = await response.json();
    const message = responseData.choices[0].message.content.trim();
    res.json({ status: 'success', photoUrl, message });
  } catch (error) {
    console.error('Error uploading image:', error);

    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
