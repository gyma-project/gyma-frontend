import { useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";
import { createTransaction } from "@/service/api/transactions";
import { useSession } from "next-auth/react";
import Select from "@/components/atoms/Select";
import SearchAutoComplete from "@/components/atoms/SearchAutoComplete";
import { Role } from "@/service/api/profiles";
import { EntityType } from "@/components/atoms/MultipleAutoComplete";
import MultipleAutoComplete from "@/components/atoms/MultipleAutoComplete";

export default function TransactionsCreate() {
  const { register, handleSubmit, reset, setValue } = useForm();

  const session = useSession();

  const onSubmit = async (data: any) => {
    if (!session.data || !session.data.user?.uuid) {
      alert("Erro: Sessão do usuário não encontrada");
      return;
    }

    const transactionData = {
      createdById: session.data.user.uuid,
      updateById: session.data.user.uuid,
      price: data.price,
      description: data.description,
      category: data.category,
    };

    try {
      await createTransaction(transactionData);
      alert("Transação cadastrada com sucesso!");
      reset();
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
      <PageTitle>Criar Ficha de Treino</PageTitle>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <SearchAutoComplete
            label="Buscar Estudante"
            name="userId"
            role={Role.STUDENT}
            onChange={(value) => setValue("userId", value)} // Atualiza o valor no form
          />

        <MultipleAutoComplete
          label="Buscar Estudantes"
          name="userIds"
          role={Role.STUDENT}
          onChange={(value) => setValue("userIds", value)} // Atualiza o array de IDs no form
          entityType={EntityType.User}
        />

        <MultipleAutoComplete
          label="Buscar Exercícios"
          name="exerciseIds"
          role={Role.STUDENT}
          onChange={(value) => setValue("userIds", value)} // Atualiza o array de IDs no form
          entityType={EntityType.Exercise}
        />

        <Input
            label="Nome da Ficha de Treino"
            {...register("name")}
            width="100%"
          />

        <Textbox
          label="Descrição da Ficha de Treino"
          {...register("description")}
          width="100%"
          height="150px"
        />

        
        <Button type="submit">Criar</Button>
      </form>
    </div>
  );

  
}
