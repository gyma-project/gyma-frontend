import { useState } from 'react';
import FiltrarPorNome from '../FiltrarPorNome';

interface Student {
    id: number;
    name: string;
    email: string;
    birthDate: string;
    cpf: string;
    userType: string;
}

interface AlunoProps {
    students: Student[];
}

export default function Aluno({ students }: AlunoProps) {
    const [search, setSearch] = useState('');

    const filteredStudents = (students || []).filter(student =>
        student.name
            .normalize("NFD") // Normaliza o nome do aluno
            .replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .toLowerCase()
            .includes(search.toLowerCase()) // Verifica se o nome contém a busca
    );
    
    return (
        <div>
            {/* Chama o componente de filtro passando o search e setSearch */}
            <FiltrarPorNome search={search} setSearch={setSearch} />

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="group relative p-6 border border-gray-200 bg-red-100 rounded-lg shadow-lg bg-gray-50 flex justify-between items-center">
                        <div>
                            <div
                                style={{
                                    width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c",
                                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: "bold", marginRight: "10px"
                                }}
                            >
                                {student.name.charAt(0)}
                            </div>
                        </div>

                        <div className="max-w-[240px]">
                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">Email: {student.email}</p>
                            <p className="text-sm text-gray-600">Nascimento: {student.birthDate}</p>
                            <p className="text-sm text-gray-600">CPF: {student.cpf}</p>
                            <p className="text-sm text-gray-600">Tipo de usuário:
                                <span style={{
                                    backgroundColor: 'green', color: 'white', margin: "0 6px", padding: '5px 10px',
                                    display: 'inline-block', borderRadius: '5px'
                                }}>
                                    {student.userType}
                                </span>
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col space-y-5" style={{ marginLeft: "3px" }}>
                            <img src="/icons/lapis.png" alt="Editar" style={{ width: 18, height: 18 }} />
                            <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
