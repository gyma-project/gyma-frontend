import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Select from "@/components/atoms/Select";
import { createKeycloakUser } from "@/service/api/keycloak";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function CreateUser() {
    const { register, handleSubmit } = useForm();
    const session = useSession();

    const onSubmit = async (data: any) => {
        if (!session.data || !session.data.user?.uuid) {
          alert("Erro: Sessão do usuário não encontrada");
          return;
        }
      
        const keycloakUserData = {
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          userType: data.userType,
        };
      
        const newUserKeycloak = await createKeycloakUser(keycloakUserData);
      
        if (newUserKeycloak) {
          alert("Usuário criado com sucesso!");
        } else {
          alert("Erro ao criar o usuário");
        }
      };
      

    return (
        <div>
            <PageTitle>Cadastrar Usuário</PageTitle>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                            message: "Email inválido"
                        }
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
                    <option value="" disabled>Selecione um perfil</option>
                    <option value="STUDENT">Cliente</option>
                    <option value="TRAINER">Treinador</option>
                    <option value="ADMIN">Administrador</option>
                </Select>
                <Button type="submit">Cadastrar usuário</Button>
            </form>
        </div>
    );
}
