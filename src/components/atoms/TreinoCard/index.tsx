import { useEffect, useState } from "react";
import FiltrarPorNome from "../FiltrarPorNome";
import { getAllTrainingSheets, deleteTrainingSheet, getTrainingSheetsByStudent } from "@/service/api/training";
import axiosInstance from "@/service/axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'; 


interface Role {
    id: number;
    name: string;
}

interface Image {
    id: number;
    idObject: string;
    profile: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    keycloakId: string;
    active: boolean;
    roles: Role[];
    image: Image;
}

interface Exercise {
    id: number;
    muscleGroup: string;
    name: string;
    amount: number;
    repetition: number;
}

interface TrainingSheet {
    id: number;
    name: string;
    student: User;
    trainer: User;
    exercises: Exercise[];
    description: string;
    createdAt: string;
    updatedAt: string;
    updateBy: User;
}

export default function TrainingSheetCard() {
    const [search, setSearch] = useState("");
    const [trainingSheets, setTrainingSheets] = useState<TrainingSheet[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSheet, setSelectedSheet] = useState<TrainingSheet | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    console.log(session);

    const isStudent = session?.user?.profile?.roles?.some(role => role.name === "STUDENT");

    useEffect(() => {
        const fetchTrainingSheets = async () => {
            if (session?.user?.profile?.roles) {
                const isTrainerOrAdmin = session.user.profile.roles.some(role => role.name === "ADMIN" || role.name === "TRAINER");

                if (isTrainerOrAdmin) {
                    // Requisição para ADMIN ou TRAINER
                    const data = await getAllTrainingSheets();  // Assume que essa função já existe no seu código
                    setTrainingSheets(data.content || []);
                } else if (isStudent) {
                    const studentKeycloakId = session.user.uuid;  // UUID do estudante da session
                    if (studentKeycloakId) {
                        const data = await getTrainingSheetsByStudent(studentKeycloakId);
                        setTrainingSheets(data.content || []);
                    }
                }
            }
        };

        fetchTrainingSheets();
    }, [session, isStudent]);

      
    

    const confirmDelete = (sheet: TrainingSheet) => {
        setSelectedSheet(sheet);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (selectedSheet) {
            const success = await deleteTrainingSheet(selectedSheet.id.toString()); // Converte ID para string
            if (success) {
                setTrainingSheets((prev) => prev.filter((sheet) => sheet.id !== selectedSheet.id));
            }
        }
        setShowDeleteModal(false);
        setSelectedSheet(null);
    };
    

    

    const openViewModal = (sheet: TrainingSheet) => {
        setSelectedSheet(sheet);
        setShowViewModal(true);
    };

    const openEditModal = (sheet: TrainingSheet) => {
        setSelectedSheet(sheet);
        setShowEditModal(true);
    };

    const updateTrainingSheet = async (id: number, updatedData: Partial<TrainingSheet>) => {
        try {
            const response = await axiosInstance.put(`/training-sheets/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar folha de treinamento:", error);
            return null;
        }
    };

    const handleEdit = async () => {
        if (selectedSheet) {
            const updatedSheet = { ...selectedSheet, name: "Novo Nome" };
            const success = await updateTrainingSheet(updatedSheet.id, updatedSheet); // Converte ID para string
            if (success) {
                setTrainingSheets((prev) =>
                    prev.map((sheet) => (sheet.id === updatedSheet.id ? updatedSheet : sheet))
                );
                setSelectedSheet(updatedSheet);
            }
        }
        setShowEditModal(false);
    };

    const filteredTrainingSheets = trainingSheets.filter((sheet) =>
        sheet.name
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleEditRedirect = (sheet: TrainingSheet) => {
        router.push(`/training/${sheet.id}/update`); // Redireciona para a página de atualização
    };

    const handleCreateRedirect = () => {
        router.push('/training/create'); // Adiciona a navegação para a página de criação
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-6">
                <FiltrarPorNome search={search} setSearch={setSearch} />
            </div>

            <div className="mb-6">
                <button
                    onClick={handleCreateRedirect}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800"
                >
                    Criar Novo Treino
                </button>
            </div>  

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrainingSheets.map((sheet) => (
                    <div
                        key={sheet.id}
                        className="p-4 border border-gray-200 rounded-lg shadow-md bg-red-100 flex justify-between items-center"
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#e74c3c",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                marginRight: "10px",
                            }}
                        >
                            {sheet.name.charAt(0)}
                        </div>

                        <div className="flex-1 max-w-[240px]">
                            <h2 className="text-lg font-semibold text-red-500">{sheet.name}</h2>
                            <p>{sheet.description}</p>
                        </div>

                        <div className="mt-4 flex flex-col space-y-5">
                            <img
                                src="/icons/icon-eye.svg"
                                alt="Visualizar"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => openViewModal(sheet)}
                            />
                            {!isStudent && (
                                <>
                                    <img
                                        src="/icons/icon-edit.svg"
                                        alt="Editar"
                                        className="w-5 h-5 cursor-pointer"
                                        onClick={() => handleEditRedirect(sheet)} // Chama a função de redirecionamento
                                    />
                                    <img
                                        src="/icons/icon-trash.svg"
                                        alt="Excluir"
                                        className="w-5 h-5 cursor-pointer"
                                        onClick={() => confirmDelete(sheet)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Visualização */}
            {showViewModal && selectedSheet && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="flex flex-col items-start space-y-3">
                            <h2 className="text-lg font-bold">{selectedSheet.name}</h2>
                            <p>
                                <strong>Aluno: </strong>{selectedSheet.student.firstName} {selectedSheet.student.lastName}
                            </p>
                            <p>
                                <strong>Treinador: </strong>{selectedSheet.trainer.firstName} {selectedSheet.trainer.lastName}
                            </p>
                            <p>
                                <strong>Criado em: </strong>{new Date(selectedSheet.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Atualizado em: </strong>{new Date(selectedSheet.updatedAt).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Atualizado por: </strong>{selectedSheet.updateBy.firstName} {selectedSheet.updateBy.lastName}
                            </p>
                            <h3 className="text-lg mt-9">Exercícios</h3>
                            <ul>
                                {selectedSheet?.exercises?.length ? (
                                    selectedSheet.exercises.map((exercise: Exercise) => (
                                        <li key={exercise.id}>
                                            {exercise.name} - {exercise.muscleGroup} ({exercise.amount}x{exercise.repetition})
                                        </li>
                                    ))
                                ) : (
                                    <li>Nenhum exercício disponível</li>
                                )}
                            </ul>

                        </div>
                        <button
                            onClick={() => setShowViewModal(false)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteModal && selectedSheet && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold">Deseja apagar este treino?</h2>
                        <p className="text-gray-600 mt-2">{selectedSheet.name}</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edição */}
            {showEditModal && selectedSheet && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold">Editar Treino</h2>
                        <div className="mt-4">
                            <input
                                type="text"
                                value={selectedSheet.name}
                                onChange={(e) => setSelectedSheet({ ...selectedSheet, name: e.target.value })}
                                className="border border-gray-300 p-2 rounded-md"
                            />
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
