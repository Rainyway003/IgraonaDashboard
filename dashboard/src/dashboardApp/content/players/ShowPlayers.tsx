import React, {PropsWithChildren, useState} from 'react';
import {Layout, theme, Table, Space, Form, Button, Input} from 'antd';

const {Content} = Layout;

import {useOne} from "@refinedev/core"
import {useParams} from 'react-router';

import BanPlayer from './BanPlayer';
import {CreateButton, useForm} from "@refinedev/antd";
import {ArrowLeftOutlined, PlusSquareOutlined} from "@ant-design/icons";

const ShowPlayers: React.FC<PropsWithChildren<{}>> = ({children, teamId}) => {
    const {id} = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);


    const {data: tData,} = useOne({
        resource: 'tournaments',
        id: id ?? "",
    })
    const tournament = tData?.data


    const {formProps, saveButtonProps, query, onFinish} = useForm({
        resource: "participants",
        id: teamId,
        action: "edit",
        meta: {
            id: tournament?.id
        },
        onMutationSuccess: () => {
            setIsEdit(!isEdit)
        }
    });


    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();


    const {data, isLoading} = useOne({
        resource: "participants",
        id: id,
        meta: {
            teamId: teamId,
        },
    })
    const team = data?.data

    console.log(team)


    const columns = [
        {
            title: isEdit ?
                <Form.Item className={'m-0'} name="name" initialValue={team?.name}>
                    <Input placeholder={'Ime tima'}/>
                </Form.Item>
                :
                <div>{team?.name}</div>,
            dataIndex: 'player1',
            key: 'player1',
            render: (_: any, record: any, index: number) => (
                isEdit ?
                    <Form.Item className={'m-0'} name={`player${index + 1}`} initialValue={record.url}>
                        <Input placeholder={`${index + 1}`}/>
                    </Form.Item>
                    :
                    <Space>
                        {record.url}
                    </Space>
            ),
        },
        {
            title: isEdit ?
                <Form.Item className={'m-0'} name={'number'} initialValue={team?.number}>
                    <Input placeholder={'Kontakt'}/>
                </Form.Item>
                :
                <div>{team?.number}</div>,
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Akcije',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    {/* <DeleteButton hideText size="small" resource="tournaments" recordItemId={record.id} /> */}
                    <BanPlayer player={record}></BanPlayer>
                </Space>
            ),
        },
    ];

    const handleEditClick = () => {
        setIsEdit(!isEdit)
    }


    return (
        <Form {...formProps} layout="vertical">
            <Form.Item className={'flex justify-end'}>
                {isEdit ?
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="antbutton"
                    >
                        Submit
                    </Button>
                    :
                    <CreateButton
                        type="primary"
                        className="antbutton"
                        onClick={handleEditClick}
                    >
                        Edit
                    </CreateButton>
                }
            </Form.Item>
            <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
                <Content
                    style={{
                        margin: '1px 1px',
                        width: '100%',
                        padding: 4,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >

                    <Table
                        loading={isLoading}
                        dataSource={data?.data.players}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            position: ['bottomCenter'],
                        }}
                        onRow={(record) => ({
                            onClick: (event) => {
                                const target = event.target as HTMLElement;
                                if (
                                    target.closest('button') ||
                                    target.closest('input') ||
                                    target.closest('.ant-modal')
                                ) {
                                    return;
                                }
                                window.location.replace(`${record.name}`)
                            },
                        })}
                    />
                    {children}
                </Content>
            </Layout>
        </Form>
    );
};

export default ShowPlayers;