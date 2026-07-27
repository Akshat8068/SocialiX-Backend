

const cookiesoptions={
    httpOnly:true,
    secure: true,
    sameSite: "strict"as const,
    maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
}
export default cookiesoptions