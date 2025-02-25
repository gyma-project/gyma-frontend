import { useState, useEffect } from 'react';
import FiltrarPorNome from '../FiltrarPorNome';
import axiosInstance from '@/service/axios';

interface Role {
    id: number;
    name: string;
}

interface Image {
    id: number;
    idObject: string;
    profile: string;
}

interface Profile {
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

interface ApiResponse {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Profile[];
    number: number;
    sort: any[];
    numberOfElements: number;
    pageable: any;
    first: boolean;
    last: boolean;
    empty: boolean;
}

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

const getProfiles = async (page: number = 0, size: number = 10): Promise<ApiResponse> => {

    try {
        const response = await axiosInstance.get<ApiResponse>('/profiles', {
            params: { page, size },
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.status !== 200) {
            throw new Error("Erro ao buscar perfis");
        }

        return response.data;
    } catch (error) {
        console.error("Erro:", error);
        return {
            totalElements: 0,
            totalPages: 0,
            size: 0,
            content: [],
            number: 0,
            sort: [],
            numberOfElements: 0,
            pageable: {},
            first: true,
            last: true,
            empty: true,
        };
    }
};

const deleteProfile = async (id: number) => {
    if (!id) return false;

    try {
        const response = await axiosInstance.delete(`/profiles/${id}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.status === 200 || response.status === 204) {
            return true;
        } else {
            console.error("Erro ao deletar o perfil:", response.status, response.data);
            return false;
        }
    } catch (error) {
        console.error("Erro:", error);
        return false;
    }
};

const updateProfile = async (profileId: number, updatedData: { email: string; firstName: string; lastName: string; username: string; image: File | null }) => {
    const formData = new FormData();
    formData.append('email', updatedData.email);
    formData.append('firstName', updatedData.firstName);
    formData.append('lastName', updatedData.lastName);
    formData.append('username', updatedData.username);
    if (updatedData.image) formData.append('image', updatedData.image);

    try {
        const response = await axiosInstance.put(
            `/profiles/${profileId}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.status === 200;
    } catch (error: any) {
        console.error("Erro ao atualizar perfil:", error.response || error.message);
        return false;
    }
};

export default function Usuarios() {
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState<Profile[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            const data = await getProfiles(0, 10);
            setStudents(data.content);
        };

        fetchProfiles();
    }, [search]);

    const filteredProfiles = students.filter(student =>
        (student.firstName + ' ' + student.lastName)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const getUserRole = (roles: Role[]) => {
        const role = roles[0]?.name;
        if (role === 'trainer') return 'Trainador';
        if (role === 'student') return 'Aluno';
        return 'Desconhecido';
    };

    const handleDeleteClick = (id: number) => {
        setProfileToDelete(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (profileToDelete !== null) {
            const isDeleted = await deleteProfile(profileToDelete);
            if (isDeleted) {
                const data = await getProfiles(0, 10);
                setStudents(data.content);
                setShowModal(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    const handleEditClick = (profile: Profile) => {
        setProfileToEdit(profile);
        setNewEmail(profile.email);
        setNewFirstName(profile.firstName);
        setNewLastName(profile.lastName);
        setNewUsername(profile.username);
        setShowEditModal(true);
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setProfileToEdit(null);
    };

    const handleConfirmEdit = async () => {
        if (profileToEdit) {
            const updatedData = {
                email: newEmail,
                firstName: newFirstName,
                lastName: newLastName,
                username: newUsername || profileToEdit.username,
                image: newImage,
            };
    
            const isUpdated = await updateProfile(profileToEdit.id, updatedData);
            if (isUpdated) {
                const data = await getProfiles(0, 10);
                setStudents(data.content);
                setShowEditModal(false);
            } else {
                console.error("Erro ao atualizar perfil");
            }
        }
    };

    return (
        <div>
            <FiltrarPorNome search={search} setSearch={setSearch} />

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredProfiles.map((profile) => (
                    <div key={profile.id} className="group relative p-6 border border-gray-200 bg-red-100 rounded-lg shadow-lg bg-gray-50 flex justify-between items-center">
                        <div>
                            <div
                                style={{
                                    width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c",
                                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: "bold", marginRight: "10px"
                                }}
                            >
                                {profile.firstName.charAt(0)}
                            </div>
                        </div>

                        <div className="max-w-[240px]">
                            <h3 className="text-lg font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                            <p className="text-sm text-gray-600">Email: {profile.email}</p>
                            <p className="text-sm text-gray-600">Tipo de usuário:
                                <p style={{
                                    backgroundColor: 'green', color: 'white', margin: "0 6px", padding: '5px 10px',
                                    display: 'inline-block', borderRadius: '5px'
                                }} >
                                    {getUserRole(profile.roles)}
                                </p>
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col space-y-5" style={{ marginLeft: "3px" }}>
                            <img src="/icons/lapis.png"
                                alt="Editar"
                                style={{ width: 18, height: 18 }}
                                onClick={() => handleEditClick(profile)} />
                            <img
                                src="/icons/lixeira.png"
                                alt="Excluir"
                                style={{ width: 18, height: 18 }}
                                onClick={() => handleDeleteClick(profile.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de confirmação de exclusão */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900">Tem certeza que deseja excluir este perfil?</h3>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edição */}
            {showEditModal && profileToEdit && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Perfil</h3>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="firstName" className="block text-sm font-semibold">Nome</label>
                            <input
                                id="firstName"
                                type="text"
                                value={newFirstName}
                                onChange={(e) => setNewFirstName(e.target.value)}
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="lastName" className="block text-sm font-semibold">Sobrenome</label>
                            <input
                                id="lastName"
                                type="text"
                                value={newLastName}
                                onChange={(e) => setNewLastName(e.target.value)}
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="username" className="block text-sm font-semibold">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Campo para atualizar imagem */}
                        <div className="mt-4">
                            <label htmlFor="image" className="block text-sm font-semibold">Imagem de Perfil</label>
                            <input
                                id="image"
                                type="file"
                                onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmEdit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
