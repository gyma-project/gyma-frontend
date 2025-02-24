import { useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Select from "@/components/atoms/Select";
import { getProfiles } from "@/service/api/profiles";
import { useEffect, useState } from "react";
import { Profile } from "@/service/api/profiles";
import Textbox from "@/components/atoms/Textbox";

export default function CreateWorkout() {
  const { register, handleSubmit, setValue } = useForm();
  const [students, setStudents] = useState<Profile[]>([]);
  const [trainers, setTrainers] = useState<Profile[]>([]);  // Estado para os treinadores
  const [searchTermStudent, setSearchTermStudent] = useState("");  // Pesquisa para alunos
  const [filteredStudents, setFilteredStudents] = useState<Profile[]>([]);
  const [searchTermTrainer, setSearchTermTrainer] = useState("");  // Pesquisa para treinadores
  const [filteredTrainers, setFilteredTrainers] = useState<Profile[]>([]);

  // Função para buscar alunos e treinadores
  useEffect(() => {
    const fetchProfiles = async () => {
      const studentsData = await getProfiles("STUDENT");
      setStudents(studentsData);
      const trainersData = await getProfiles("TRAINER");
      setTrainers(trainersData);
    };

    fetchProfiles();
  }, []);

  // Filtrando alunos
  useEffect(() => {
    if (searchTermStudent) {
      const filtered = students.filter((student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchTermStudent.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchTermStudent, students]);

  // Filtrando treinadores
  useEffect(() => {
    if (searchTermTrainer) {
      const filtered = trainers.filter((trainer) =>
        `${trainer.firstName} ${trainer.lastName}`
          .toLowerCase()
          .includes(searchTermTrainer.toLowerCase())
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers([]);
    }
  }, [searchTermTrainer, trainers]);

  const onSubmit = async (data: any) => {
    try {
      // Aqui você pode adicionar a lógica para enviar a ficha de treino
      console.log("Dados do formulário:", data);
      alert("Ficha de treino cadastrada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        alert("Erro ao cadastrar ficha de treino: " + error.message);
      } else {
        alert("Erro ao cadastrar ficha de treino: Ocorreu um erro desconhecido");
      }
    }
  };

  return (
    <div>
      <PageTitle>Cadastrar Ficha de Treino</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Buscar Aluno"
          placeholder="Digite o nome do aluno..."
          value={searchTermStudent}
          onChange={(e) => setSearchTermStudent(e.target.value)}
        />
        {searchTermStudent && (
          <Select
            {...register("studentId", { required: "O aluno é obrigatório" })}
          >
            <option value="" selected disabled>
              Selecione um aluno...
            </option>
            {filteredStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </Select>
        )}

        <Input
          label="Buscar Treinador"
          placeholder="Digite o nome do treinador..."
          value={searchTermTrainer}
          onChange={(e) => setSearchTermTrainer(e.target.value)}
        />
        {searchTermTrainer && (
          <Select
            {...register("trainerId", { required: "O treinador é obrigatório" })}
          >
            <option value="" selected disabled>
              Selecione um treinador...
            </option>
            {filteredTrainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.firstName} {trainer.lastName}
              </option>
            ))}
          </Select>
        )}

        <Input
          {...register("workoutName", { required: "O nome da ficha é obrigatório" })}
          label="Nome da Ficha"
          placeholder="Digite o nome da ficha de treino..."
          required
        />
        <Textbox
          {...register("workoutDescription", {
            required: "A descrição da ficha é obrigatória",
          })}
          height="60px"
          label="Descrição da Ficha"
          placeholder="Digite a descrição da ficha de treino..."
          required
        />
        <Button type="submit">Cadastrar Ficha</Button>
      </form>
    </div>
  );
}
