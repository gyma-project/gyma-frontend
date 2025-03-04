const uploadImageToMinIO = async (image: File, userUUID: string) => {
    const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;
    const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME;
    const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
    const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;
  
    const formData = new FormData();
    formData.append("file", image);
  
    try {
      const response = await fetch(
        `${MINIO_URL}/${BUCKET_NAME}/${userUUID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": image.type,
            Authorization: `Bearer ${MINIO_ACCESS_KEY}:${MINIO_SECRET_KEY}`,
          },
          body: image,
        }
      );
  
      if (!response.ok) {
        throw new Error("Falha ao enviar imagem para o MinIO");
      }
  
      return `${MINIO_URL}/${BUCKET_NAME}/${userUUID}`;
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao enviar imagem para o MinIO");
    }
  };
  
  export default uploadImageToMinIO;
  