import axios from "axios";

interface TransactionData {
  createdById: string;
  updateById: string;
  price: number;
  description: string;
  category: string;
}

export const createTransaction = async (transactionData: TransactionData) => {
  try {
    const response = await axios.post("http://localhost:8081/transactions", transactionData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Erro ao cadastrar transação");
    }

    return response.data;
  } catch (error) {
    return [];
  }
};
