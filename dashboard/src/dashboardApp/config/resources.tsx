import {IResourceItem} from "@refinedev/core";

export const resources: IResourceItem[] = [
    {
        name: 'home',
        list: '/',
    },
    {
        name: 'tournaments',
        list: '/tournaments',
        create: '/tournaments/new',
        edit: '/tournaments/edit/:id'
    },
    {
        name: 'participants',
        list: '/tournaments/:id',
        edit: '/tournaments/:id/edit'
    },
    {
        name: 'players',
        list: '/tournaments/:id/:name',
    },
    {
        name: 'games',
        list: '/games',
        create: '/games/new',
        edit: '/games/edit/:id'
    },
    {
        name: 'banned',
        list: '/banned',
        create: '/banned/new',
        edit: '/banned/edit/:id'
    },
]