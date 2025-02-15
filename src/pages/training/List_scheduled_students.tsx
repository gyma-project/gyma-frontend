import { FC } from "react";
import React from 'react';

import FiltrarPorNome from "@/components/atoms/FiltrarPorNome";

interface List_scheduled_studentsProps {
    horario: string;
}

const List_scheduled_students: FC<List_scheduled_studentsProps> = ({ horario }) => {
    const [search, setSearch] = React.useState("");

    // Lista de alunos
    const alunos = [
        { nome: "João" },
        { nome: "Maria" },
        { nome: "José" },
    ];

    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome
            .normalize("NFD") // Normaliza o nome do aluno
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(search.toLowerCase()) 
    );

    return (
        <div>
            <h2 className="mt-4">
                Alunos cadastrados para o horário {horario}
            </h2>
            <div className="mb-6">
                <FiltrarPorNome search={search} setSearch={setSearch} />
            </div>
            <ul className="mt-4 gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {alunosFiltrados.map((aluno, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-2 border-b bg-red-50 rounded-xl shadow-md border-red-400"
                    >
                        <p>{aluno.nome}</p>
                        <div className="flex flex-col items-center space-y-3 text-red-500">
                            <img
                                src="/icons/lixeira.png"
                                alt="Excluir"
                                style={{ width: 18, height: 18 }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List_scheduled_students;

