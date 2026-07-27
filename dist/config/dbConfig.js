import AppDataSource from "./appDataSource.js";
const DBConnection = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Db connected");
    }
    catch (error) {
        console.log("db not connected");
    }
};
export default DBConnection;
//# sourceMappingURL=dbConfig.js.map