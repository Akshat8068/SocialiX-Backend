
import AppDataSource from "./app.DataSource.js"

const DBConnection= async ()=>{
    try {
         await AppDataSource.initialize()
        console.log("Db connected")
    } catch (error) {
        console.log(`${error}`)
    }
}
export default DBConnection