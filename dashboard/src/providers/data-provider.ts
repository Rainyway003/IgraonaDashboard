import { DataProvider } from "@refinedev/core";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const dataProvider: DataProvider = {
    getList: async ({ resource }): Promise<{ data: any, total: number }> => {
        const turnirDoc = collection(db, resource)
        const turnirSnap = await getDocs(turnirDoc)

        const data = turnirSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

        console.log(data)

        return {
            data,
            total: length
        }
    },
    create: ({ resource, variables, meta }) => { throw new Error("Nema jos"); },
    update: ({ resource, id, variables, meta }) => { throw new Error("Nema jos"); },
    deleteOne: ({ resource, id, variables, meta }) => { throw new Error("Nema jos"); },
    getOne: ({ resource, id, meta }) => { throw new Error("Nema jos"); },
    getApiUrl: () => "",
}

export default dataProvider