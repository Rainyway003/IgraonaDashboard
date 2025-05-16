import {
    CreateParams,
    CreateResponse,
    DataProvider,
    DeleteOneParams,
    DeleteOneResponse,
    UpdateParams
} from "@refinedev/core";
import {
    addDoc,
    collection,
    deleteDoc,
    deleteField,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    query,
    orderBy,
    updateDoc,
    WithFieldValue,
    increment
} from "firebase/firestore";
import {db} from "./firebase";

const dataProvider: DataProvider = {
    getList: async ({resource, meta, sorters, filters}: {
        resource: string,
        meta?: any,
        sorters: any,
        filters: any
    }): Promise<{ data: any, total: number }> => {
        if (resource === "participants" && meta?.id) {
            const teamsDoc = collection(db, "tournaments", String(meta.id), resource)
            const teamsSnap = await getDocs(teamsDoc)

            console.log('evo', teamsSnap)

            const teams = teamsSnap.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))

            console.log(teams)

            return {data: teams, total: teams.length}
        }

        const turnirDoc = collection(db, resource)

        let turnirQuery = query(turnirDoc)

        if (sorters && sorters.length > 0) {
            sorters.forEach((sorter: any) => {
                turnirQuery = query(turnirQuery, orderBy(sorter.field, sorter.order || 'asc'));
            });
        }


        const turnirSnap = await getDocs(turnirQuery)

        const data = turnirSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))


        return {
            data,
            total: data.length
        }
    },
    create: async <TData = any, TVariables = DocumentData>(
        {resource, variables}: CreateParams<TVariables>
    ): Promise<CreateResponse<TData>> => {
        if (resource === "tournaments") {
            console.log(variables)
            const docRef = await addDoc(
                collection(db, resource),
                variables as WithFieldValue<DocumentData>
            );


            return {
                data: {
                    id: docRef.id,
                    ...variables,
                } as TData,
            };
        } else if (resource === "games") {
            const docRef = await addDoc(
                collection(db, resource),
                variables as WithFieldValue<DocumentData>
            );

            return {
                data: {
                    id: docRef.id,
                    ...variables,
                } as TData,
            };
        } else if (resource === "participants") {
            console.log(variables)
            const docRef = await addDoc(collection(db, "tournaments", variables.id, resource),
                variables as WithFieldValue<DocumentData>
            );

            const turnirDoc = doc(db, "tournaments", variables.id);
            await updateDoc(turnirDoc, {
                numberOfParticipants: increment(1),
            })

            return {
                data: {
                    id: docRef.id,
                    ...variables,
                } as TData,
            };
        }

    },
    update: async <TData = any, TVariables = DocumentData>(
        {resource, id, variables}: UpdateParams<TVariables>
    ): Promise<CreateResponse<TData>> => {
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

    },
    deleteOne: async <TData = any, TVariables = {}>(
        {resource, id, meta}: DeleteOneParams<TVariables>
    ): Promise<DeleteOneResponse<TData>> => {
        if (resource === "tournaments" || resource === "games" || resource === "banned") {
            const docRef = doc(db, resource, id as string);
            await deleteDoc(docRef);

            return {
                data: {id} as TData,
            };
        } else if (resource === "participants") {
            const docRef = doc(db, "tournaments", String(meta?.id), resource, String(id))
            console.log(docRef)
            await deleteDoc(docRef);

            return {
                data: {id} as TData,
            };
        }
    },
    getOne: async ({resource, id, meta}: { resource: string, id: any, meta?: any }): Promise<{ data: any }> => {
        if (resource === "participants") {
            const teamRef = doc(db, "tournaments", String(id), resource, String(meta?.teamId));
            const teamSnap = await getDoc(teamRef);

            const teamData = teamSnap.data();

            console.log('evonja', teamData);

            if (teamData) {
                const players = Object.entries(teamData)
                    .filter(([key]) => key.startsWith("player"))
                    .map(([key, url], index) => ({
                        name: `Player ${index + 1}`,
                        url,
                    }));

                return {data: {players}};
            }

            return {data: {players: []}};
        }

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
            const participantSnap = await getDoc(participantRef);

            if (participantSnap.exists()) {
                const teamsMap = participantSnap.data().teams;

                if (teamsMap) {
                    const teams = Object.keys(teamsMap).map((teamKey) => {
                        const team = teamsMap[teamKey];
                        return {
                            id: teamKey,
                            name: team.name,
                            players: [
                                team.player1,
                                team.player2,
                                team.player3,
                                team.player4,
                            ],
                        };
                    });

                    data["teams"] = teams;
                    (data as any).teams = teams;
                    console.log('EventCounts', teams);
                }
            } else {
                console.log('Nema timova.');
                (data as any).teams = [];
            }
        }

        return {data};
    },


    getApiUrl: () => "",
}

export default dataProvider