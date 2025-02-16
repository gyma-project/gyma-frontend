import { useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";
import { createTransaction } from "@/service/api/transactions";
import { useSession } from "next-auth/react";
import Select from "@/components/atoms/Select";

export default function TransactionsCreate() {
  const {
    register,
    handleSubmit,
  } = useForm();

  const session = useSession();

  const onSubmit = async (data: any) => {
    //@ts-ignore
    if (!session.data || !session.data.user?.uuid) {
      alert("Erro: Sessão do usuário não encontrada");
      return;
    }

    const transactionData = {
      //@ts-ignore
      createdById: session.data.user.uuid,
      //@ts-ignore
      updateById: session.data.user.uuid,
      price: data.price,
      description: data.description,
      category: data.type
    };

    try {
      await createTransaction(transactionData);
      alert("Transação cadastrada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert("Erro ao cadastrar transação: " + error.message);
      } else {
        alert("Erro ao cadastrar transação: Ocorreu um erro desconhecido");
      }
    }

  };
  return (
    <div>
      <PageTitle>Cadastrar transação</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          {...register("price", {
            required: "O valor é obrigatório",
            min: { value: 1, message: "O valor deve ser maior que 0" },
          })}
          label="Valor"
          placeholder="Digite o valor da transação..."
          type="number"
          required
        />
        <Select label="Tipo">
          <option value="">a</option>
        </Select>
        <Input
          {...register("type", {
            required: "O tipo é obrigatório",
          })}
          label="Tipo"
          placeholder="Digite o tipo da transação..."
          required
        />
        <Textbox
          {...register("description", {
            required: "A descrição é obrigatória",
          })}
          height="60px"
          label="Descrição"
          placeholder="Digite a descrição da transação..."
          required
        />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}
