import { useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";
import { getTrainingSession, updateTrainingSession } from "@/service/api/training";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SearchAutoComplete from "@/components/atoms/SearchAutoComplete";
import MultipleAutoComplete from "@/components/atoms/MultipleAutoComplete";
import { Role } from "@/service/api/profiles";
import { EntityType } from "@/components/atoms/MultipleAutoComplete";

export default function TrainingEdit() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const router = useRouter();
  const { id } = router.query; // Pega o ID da URL
  const session = useSession();
  const [training, setTraining] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Carrega os dados da ficha de treino
      getTrainingSession(id as string).then((data) => {
        setTraining(data);
        // Preenche os campos do formulário com os dados existentes
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("userId", data.student);
        setValue("exerciseIds", data.exerciseIds);
      });
    }
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    if (!session.data || !session.data.user?.uuid) {
      alert("Erro: Sessão do usuário não encontrada");
      return;
    }

    const treinoData = {
      name: data.name,
      student: data.userId, // ID do estudante
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

    try {
      await updateTrainingSession(id as string, treinoData); // Atualiza a ficha de treino
      alert("Ficha de treino atualizada com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar ficha de treino.");
      console.error(error);
    }
  };

  return (
    <div>
      <PageTitle>Editar Ficha de Treino</PageTitle>

      {training && (
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

          <Button type="submit">Salvar</Button>
        </form>
      )}
    </div>
  );
}
