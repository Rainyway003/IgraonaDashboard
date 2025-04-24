import { BaseRecord, CreateParams, CreateResponse, DataProvider, DeleteOneParams, DeleteOneResponse, GetOneParams, GetOneResponse, UpdateParams } from "@refinedev/core";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, setDoc, updateDoc, WithFieldValue } from "firebase/firestore";
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
    create: async <TData = any, TVariables = DocumentData>(
        { resource, variables }: CreateParams<TVariables>
    ): Promise<CreateResponse<TData>> => {
        const docRef = await addDoc(
            collection(db, resource),
            variables as WithFieldValue<DocumentData>
        );

        await setDoc(doc(db, resource, docRef.id, "participants", docRef.id), {
            tName: variables.tournamentName,
            id: docRef.id,
            teams: {},
        })

        return {
            data: {
                id: docRef.id,
                ...variables,
            } as TData,
        };
    },
    update: async <TData = any, TVariables = DocumentData>(
        { resource, id, variables }: UpdateParams<TVariables>
    ): Promise<CreateResponse<TData>> => {
        if (resource === "participants") {
            await updateDoc(doc(db, "tournaments", String(id), resource, String(id)), {
                [`teams.${variables.name}`]: {
                    ...variables
                }
            })
            return {
                data: {
                    id: id,
                    ...variables,
                } as TData
            }
        } else if (resource === "tournaments") {
            const docRef = doc(db, resource, String(id));

            await updateDoc(docRef, {
                ...variables
            })

            return {
                data: {
                    id: id,
                    ...variables,
                } as TData
            }
        }

    },
    deleteOne: async <TData = any, TVariables = {}>(
        { resource, id }: DeleteOneParams<TVariables>
    ): Promise<DeleteOneResponse<TData>> => {
        const docRef = doc(db, resource, id as string);
        await deleteDoc(docRef);

        return {
            data: { id } as TData,
        };
    },
    getOne: async <TData extends BaseRecord = BaseRecord>(
        { resource, id }: GetOneParams
    ): Promise<GetOneResponse<TData>> => {
        const docRef = doc(db, resource, String(id));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error(`Document with id ${id} not found`);
        }

        const data = {
            id: docSnap.id,
            ...(docSnap.data() as TData),
        };

        if (resource === "tournaments") {
            const participantRef = doc(db, resource, String(id), "participants", String(id));
            const participantSnap = await getDoc(participantRef)

            if (participantSnap.exists()) {
                const teamsMap = participantSnap.data().teams

                if (teamsMap) {
                    const teams = Object.keys(teamsMap).map((teamKey) => ({
                        id: teamKey,
                        ...teamsMap[teamKey]
                    }));

                    (data as any).teams = teams
                    console.log(teams)
                }
            } else {
                console.log('Nema timova.');
                (data as any).teams = [];
            }
        }

        return { data }
    },
    getApiUrl: () => "",
}

export default dataProvider