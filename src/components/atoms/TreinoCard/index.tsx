import { useEffect, useState } from "react";
import FiltrarPorNome from "../FiltrarPorNome";
import { getTrainingSheets, deleteTrainingSheet } from "@/service/api/training-sheets";

interface TrainingSheet {
    id: number;
    description: string;
}

export default function TrainingSheetCard() {
    const [search, setSearch] = useState("");
    const [trainingSheets, setTrainingSheets] = useState<TrainingSheet[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
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

    const filteredTrainingSheets = trainingSheets.filter((sheet) =>
        sheet.description
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
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
                            {sheet.description.charAt(0)}
                        </div>

                        <div className="flex-1 max-w-[240px]">
                            {/*Alterar para nome do treino*/}
                            <h2 className="text-lg font-semibold text-red-500">{sheet.description}</h2>
                        </div>

                        <div className="mt-4 flex flex-col space-y-5">
                            <img
                                src="/icons/olho.png"
                                alt="Visualizar"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => openViewModal(sheet)}
                            />
                            <img src="/icons/lapis.png" alt="Editar" className="w-5 h-5 cursor-pointer" />
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
                        <h2 className="text-lg">{selectedSheet.description}</h2>{/*Alterar para nome do treino*/}
                        <h2 className="text-lg">{selectedSheet.description}</h2>
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
                        <p className="text-gray-600 mt-2">{selectedSheet.description}</p>
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
        </div>
    );
}
