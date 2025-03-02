
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
    content: Profile[];  // A propriedade content é o array de perfis.
    number: number;
    sort: any[];
    numberOfElements: number;
    pageable: any;
    first: boolean;
    last: boolean;
    empty: boolean;
}