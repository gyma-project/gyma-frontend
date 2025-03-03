import { useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";
import { createTrainingSession } from "@/service/api/training";
import { useSession } from "next-auth/react";
import SearchAutoComplete from "@/components/atoms/SearchAutoComplete";
import MultipleAutoComplete from "@/components/atoms/MultipleAutoComplete";
import { Role } from "@/service/api/profiles";
import { EntityType } from "@/components/atoms/MultipleAutoComplete";

export default function TrainingCreate() {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const session = useSession();
  
  const onSubmit = async (data: any) => {
    if (!session.data || !session.data.user?.uuid) {
      alert("Erro: Sessão do usuário não encontrada");
      return;
    }

    const treinoData = {
      name: data.name,
      student: data.userId, // ID do estudante selecionado
      trainer: session.data.user.uuid, // ID do treinador (usuário logado)
      description: data.description,
      exerciseIds: (data.exerciseIds || []).map(Number), // Converte IDs para números
      updateBy: session.data.user.uuid, // Quem atualizou
    };

    if (!treinoData.student) {
      alert("Erro: Selecione um estudante.");
      return;
    }

    if (!treinoData.exerciseIds.length) {
      alert("Erro: Selecione pelo menos um exercício.");
      return;
    }

    console.log("Enviando payload:", treinoData);

    try {
      await createTrainingSession(treinoData);
      alert("Ficha de treino cadastrada com sucesso!");
      reset();
    } catch (error) {
      alert("Erro ao cadastrar ficha de treino.");
      console.error(error);
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
          onChange={(value) => setValue("userId", value)}
        />

        <MultipleAutoComplete
          label="Buscar Exercícios"
          name="exerciseIds"
          onChange={(value) => setValue("exerciseIds", value)}
          entityType={EntityType.Exercise}
        />

        <Input label="Nome da Ficha de Treino" {...register("name")} width="100%" />
        <Textbox label="Descrição da Ficha de Treino" {...register("description")} width="100%" height="150px" />

        <Button type="submit">Criar</Button>
      </form>
    </div>
  );
}
