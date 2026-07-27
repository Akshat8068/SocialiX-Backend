export declare enum AccoutType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}
export declare class User {
    id: number;
    username: string;
    fulName: string;
    email: string;
    password: string;
    bio?: string;
    website?: string;
    profilePicture?: string;
    accountType: AccoutType;
    professionalAccount?: boolean;
}
//# sourceMappingURL=userEntities.d.ts.map