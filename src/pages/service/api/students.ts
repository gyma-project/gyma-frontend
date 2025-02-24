import axiosInstance from "@/pages/service/axios";

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

export const getProfiles = async (page: number = 0, size: number = 10) => {
    try {
        const response = await axiosInstance.get<ApiResponse>(`/profiles`, {
            params: { page, size }
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
