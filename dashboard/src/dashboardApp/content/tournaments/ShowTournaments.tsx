import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Avatar, Space, Progress, Select} from 'antd';
import { AntDesignOutlined, EyeOutlined } from '@ant-design/icons';

const { Content } = Layout;

import { useList } from "@refinedev/core"
import {CreateButton, DeleteButton, EditButton, useSelect} from '@refinedev/antd';
import { useNavigate } from 'react-router';

const ShowTournaments: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const navigate = useNavigate()

    const [filter, setFilter] = useState("Dnd")
    const [selectedGame, setSelectedGame] = useState<string | undefined>(undefined);

    const {selectProps} = useSelect({
        resource: 'games',
        optionLabel: "name",
        optionValue: "name",
    })

    const tournamentId = window.location.pathname.split('/')[2]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading } = useList({
        resource: "tournaments",
        meta: {
            tournamentId,
        },
        filters: selectedGame
            ? [{ field: "game", operator: "contains", value: selectedGame }]
            : [],
        sorters: [
            {
                field: 'maxNumberOfParticipants',
                order: 'asc'
            }
        ],
    })


console.log('ev',selectProps)

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: () => <Avatar icon={<AntDesignOutlined />} />,
        },
        {
            title: 'Naziv turnira',
            dataIndex: 'name',
            key: 'name',
            filteredValue: null
        },
        {
            title: 'Naziv turnira',
            dataIndex: 'gameName',
            key: 'gameName',
        },

        {
            title: 'Igra',
            dataIndex: 'game',
            key: 'game',
            filters: [
                { text: 'Dnd', value: 'Dnd' },
                { text: 'Fifa', value: 'Fifa' },
                { text: 'Chess', value: 'Chess' },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.game === value,
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <Select
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        style={{ width: 200 }}
                        {...selectProps} // koristimo selectProps za opcije
                    />
                </div>
            ),
        },
        {
            title: 'Prijave',
            dataIndex: 'numberOfParticipants',
            key: 'numberOfParticipants',
            render: (_: any, record: any) => (
                <Space>
                    {record.numberOfParticipants || 0} / {record.maxNumberOfParticipants || 0}
                </Space>
            ),
        },
        {
            title: 'Prijavljeni',
            dataIndex: 'numberOfParticipants',
            key: 'numberOfParticipants',
            render: (_: any, record: any) => (
                <Progress percent={record.numberOfParticipants / record.maxNumberOfParticipants * 100}></Progress>
            ),
        },
        {
            title: 'Početak',
            dataIndex: 'startingAt',
            key: 'startingAt',
        },
        {
            title: 'Kraj',
            dataIndex: 'endingAt',
            key: 'endingAt',
        },
        {
            title: 'Akcije',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <EditButton hideText size="small" resource="tournaments" icon={<EyeOutlined />} recordItemId={record.id} onClick={() => navigate(`/tournaments/${record.id}`)}></EditButton>
                    <DeleteButton hideText size="small" resource="tournaments" recordItemId={record.id} />
                </Space>
            ),
        },
    ];

    return (
        <Layout className="h-screen" style={{ display: 'flex', flexDirection: 'row' }}>
            <Layout style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <div style={{ marginBottom: 16 }} className='text-right'>
                        <CreateButton
                            className="antbutton bg-[#8D151F] hover:bg-[#6e1018] text-white border-none !hover:!bg-[#6e1018] !hover:!border-none"
                        resource="tournaments"
                            onClick={() => navigate('/tournaments/new')}
                        />
                    </div>

                    <Table
                        loading={isLoading}
                        dataSource={data?.data}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 5,
                            position: ['bottomCenter'],
                        }}
                    />

                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ShowTournaments;