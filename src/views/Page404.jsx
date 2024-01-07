import React from "react";
import { ErrorBlock, Button } from 'antd-mobile';
import styled from "styled-components";

/* Handle css */
const Page404Box = styled.div`
    padding-top: 100px;
    font-size: 40px;

    .adm-error-block-image{
        height: 400px;
    }

    .adm-error-block-description,
    .adm-error-block-description-title{
        font-size: 28px;
    }

    .btn{
        margin-top: 50px;
        display: flex;
        justify-content: center;

        .adm-button{
            margin: 0 20px;
        }
    }
`;

const Page404 = function Page404(props) {
    let { navigate } = props;

    return <Page404Box>
        <ErrorBlock status="empty" title="The page you are looking for does not exist" description="Go browse the other pages" />
        <div className="btn">
            <Button color="warning"
                onClick={() => {
                    navigate(-1);
                }}>
                Go back
            </Button>

            <Button color="primary"
                onClick={() => {
                    navigate('/', { replace: true });
                }}>
                Back to main page
            </Button>
        </div>
    </Page404Box>;
};
export default Page404;