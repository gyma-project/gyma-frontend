import axios from 'axios';

const uploadImageToMinIO = async (image: File, userUUID: string) => {
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;
  const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
  const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
  const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;

  const fileExtension = image.name.split('.').pop();
  const fileName = `${userUUID}.${fileExtension}`;

  try {
    const response = await axios.put(
      `${MINIO_URL}/${BUCKET_NAME}/${fileName}`,
      image, 
      {
        headers: {
          Authorization: `Bearer ${MINIO_ACCESS_KEY}:${MINIO_SECRET_KEY}`, 
          "Content-Type": image.type 
        },
      }
    );

    if (response.status === 200) {
      return `${MINIO_URL}/${BUCKET_NAME}/${fileName}`;
    } else {
      throw new Error("Falha ao enviar imagem para o MinIO");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao enviar imagem para o MinIO");
  }
};

export default uploadImageToMinIO;
