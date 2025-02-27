import { useEffect, useState } from "react";
import FiltrarPorNome from "../FiltrarPorNome";
import { getTrainingSheets, deleteTrainingSheet } from "@/service/api/training-sheets";
import axiosInstance from "@/service/axios";

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

    useEffect(() => {
        const fetchTrainingSheets = async () => {
            const data = await getTrainingSheets(0, 10);
            if (data) {
                setTrainingSheets(data);
            }
        };
        fetchTrainingSheets();
    }, []);

    const confirmDelete = (sheet: TrainingSheet) => {
        setSelectedSheet(sheet);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (selectedSheet) {
            const success = await deleteTrainingSheet(selectedSheet.id);
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
            const updatedSheet = { ...selectedSheet, name: "Novo Nome" }; // Exemplo de atualização
            const success = await updateTrainingSheet(updatedSheet.id, updatedSheet); // Passando id e dados
            if (success) {
                setTrainingSheets((prev) =>
                    prev.map((sheet) => (sheet.id === updatedSheet.id ? updatedSheet : sheet))
                );
                setSelectedSheet(updatedSheet); // Atualizando diretamente o selectedSheet
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

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-6">
                <FiltrarPorNome search={search} setSearch={setSearch} />
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
                        </div>

                        <div className="mt-4 flex flex-col space-y-5">
                            <img
                                src="/icons/olho.png"
                                alt="Visualizar"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => openViewModal(sheet)}
                            />
                            <img
                                src="/icons/lapis.png"
                                alt="Editar"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => openEditModal(sheet)}
                            />
                            <img
                                src="/icons/lixeira.png"
                                alt="Excluir"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => confirmDelete(sheet)}
                            />
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
                            <p>
                                <strong>Descrição: </strong>{selectedSheet.description}
                            </p>
                            <ul>
                                {selectedSheet.exercises.map((exercise) => (
                                    <li key={exercise.id}>
                                        {exercise.name} - {exercise.muscleGroup} ({exercise.amount}x{exercise.repetition})
                                    </li>
                                ))}
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
