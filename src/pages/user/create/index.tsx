import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Select from "@/components/atoms/Select";
import ImageField from "@/components/atoms/ImageField";
import { createKeycloakUser, getUUIDbyUsername } from "@/service/api/keycloak";
import { createProfile, ProfileData } from "@/service/api/profiles";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import uploadImageToMinIO from "@/service/minio"; 
import { useState } from "react";

export default function CreateUser() {
  const { register, handleSubmit, reset } = useForm();
  const session = useSession();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const onSubmit = async (data: any) => {
    if (!session.data || !session.data.user?.uuid) {
      alert("Erro: Sessão do usuário não encontrada");
      return;
    }

    // Criar usuário - Keycloak
    const keycloakUserData = {
      username: data.firstName.toLowerCase() + Math.round(Math.random() * 1000),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      userType: data.userType,
    };

    try {
      await createKeycloakUser(keycloakUserData);
    } catch {
      alert("Erro ao criar perfil no keycloak");
      return;
    }

    // Obter token do usuário criado - keycloak
    const createUserUUID = await getUUIDbyUsername(keycloakUserData.username);

    // Salvar imagem de perfil - minio
    let imageUrl = "";
    if (selectedImage) {
      try {
        imageUrl = await uploadImageToMinIO(selectedImage, createUserUUID);
      } catch (error) {
        console.error("Erro ao enviar a imagem para o MinIO:", error);
        alert("Erro ao enviar imagem para o MinIO");
        return;
      }
    }

    // Criar perfil - backend
    const dictUserType: typeof data.userType = {
      ADMIN: 1,
      TRAINER: 2,
      STUDENT: 3,
    };

    const profileData: ProfileData = {
      username: keycloakUserData.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      keycloakUserId: createUserUUID,
      imageUrl: imageUrl,
      roleIds: [dictUserType[data.userType]],
    };

    const newProfile = await createProfile(profileData);

    if (newProfile) {
      alert("Perfil criado com sucesso!");
      reset();
      setSelectedImage(null);
    } else {
      alert("Erro ao criar o perfil");
    }
  };

  return (
    <div>
      <PageTitle>Cadastrar Usuário</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <ImageField
          accept="image/jpg"
          onImageSelect={(file) => setSelectedImage(file)}
        />

        <Input
          label="Nome"
          {...register("firstName", { required: "O nome é obrigatório" })}
        />
        <Input
          label="Sobrenome"
          {...register("lastName", { required: "O sobrenome é obrigatório" })}
        />
        <Input
          label="Endereço de email"
          type="email"
          {...register("email", {
            required: "O email é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email inválido",
            },
          })}
        />
        <Input
          label="Senha do usuário"
          type="password"
          {...register("password", { required: "A senha é obrigatória" })}
        />
        <Select
          label="Tipo de usuário"
          {...register("userType", { required: "Selecione um perfil" })}
        >
          <option value="" disabled>
            Selecione um perfil
          </option>
          <option value="STUDENT">Estudante</option>
          <option value="TRAINER">Treinador</option>
          <option value="ADMIN">Administrador</option>
        </Select>
        <Button type="submit">Cadastrar usuário</Button>
      </form>
    </div>
  );
}