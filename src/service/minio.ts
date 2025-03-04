import axios from 'axios';

const uploadImageToMinIO = async (image: File, userUUID: string) => {
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;
  const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
  const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
  const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;

  const formData = new FormData();
  formData.append("file", image); // Adiciona a imagem ao FormData

  try {
    const response = await axios.put(
      `${MINIO_URL}/${BUCKET_NAME}/${userUUID}.jpg`, // URL do MinIO
      formData, // Corpo da requisição (FormData)
      {
        headers: {
          Authorization: `Bearer ${MINIO_ACCESS_KEY}:${MINIO_SECRET_KEY}`, // Autenticação
          "Content-Type": "multipart/form-data", // Axios define automaticamente, mas pode ser explícito
        },
      }
    );

    // Verifica se a requisição foi bem-sucedida
    if (response.status === 200) {
      return `${MINIO_URL}/${BUCKET_NAME}/${userUUID}.jpg`; // Retorna a URL da imagem
    } else {
      throw new Error("Falha ao enviar imagem para o MinIO");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao enviar imagem para o MinIO");
  }
};

export default uploadImageToMinIO;