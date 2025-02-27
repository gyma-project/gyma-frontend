import axiosInstance from "@/service/axios";

interface TransactionData {
  createdById: string;
  updateById: string;
  price: number;
  description: string;
  category: string;
}

export const createTransaction = async (transactionData: TransactionData) => {
  try {
    const response = await axiosInstance.post("/transactions", transactionData);
    if (response.status !== 200) {
      throw new Error("Erro ao cadastrar transação");
    }
    return response.data;
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};
