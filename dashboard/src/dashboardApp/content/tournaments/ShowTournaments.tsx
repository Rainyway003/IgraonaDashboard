import React, { PropsWithChildren } from 'react';
import { Layout, theme, Table, Avatar, Space } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';

const { Content } = Layout;

import { useList } from "@refinedev/core"
import { CreateButton, DeleteButton, EditButton } from '@refinedev/antd';
import { useNavigate } from 'react-router';

const ShowTournaments: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const navigate = useNavigate()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading } = useList({
        resource: "tournaments",
    })

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            render: () => <Avatar icon={<AntDesignOutlined />} />,
        },
        {
            title: 'Naziv turnira',
            dataIndex: 'tournamentName',
            key: 'tournamentName',
        },
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Akcije',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <EditButton hideText size="small" resource="tournaments" recordItemId={record.id} onClick={() => navigate(`/tournaments/${record.id}`)}></EditButton>
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
                    <div style={{ marginBottom: 16 }}>
                        <CreateButton
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
