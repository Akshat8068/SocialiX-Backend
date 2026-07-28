

export const Refreshcookiesoptions={
    httpOnly:true,
    secure: true,
    sameSite: "strict"as const,
    maxAge: 15 * 60 * 1000, 

}
export const Accesscookiesoptions={
    httpOnly:true,
    secure: true,
    sameSite: "strict"as const,
    maxAge: 10 * 24 * 60 * 60 * 1000 
}