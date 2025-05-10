import {useOne} from "@refinedev/core";
import {useNavigate, useParams} from "react-router";
import {Button, Form, Input, Layout, Select, Space, theme} from "antd";
import {CreateButton} from "@refinedev/antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, PlusSquareOutlined} from "@ant-design/icons";
import React from "react";

const {Content} = Layout;

const EditTeam = () => {
    const {id} = useParams();
    const navigate = useNavigate();


    const {data, isLoading} = useOne({
        resource: "participants",
        id: id
    })

    const tournament = data?.data

    console.log(tournament)

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout className="h-screen" style={{display: 'flex', flexDirection: 'row'}}>
            <Layout style={{flex: 1, backgroundColor: '#f0f2f5'}}>
                <Form.Item>
                    <div className="flex justify-between w-full">
                        <CreateButton
                            type="primary"
                            className="antbutton"
                            onClick={() => navigate('/tournaments')}
                            icon={<ArrowLeftOutlined/>}
                        >
                            Back
                        </CreateButton>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="antbutton"
                            icon={<PlusSquareOutlined/>}
                        >
                            Submit
                        </Button>

                    </div>
                </Form.Item>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Form layout="vertical">
                    </Form>
                </Content>
            </Layout>
        </Layout>
    )
}

export default EditTeam