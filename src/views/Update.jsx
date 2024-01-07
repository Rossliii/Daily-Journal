import React, { useState } from "react";
import NavBarAgain from '../components/NavBarAgain';
import ButtonAgain from '../components/ButtonAgain';
import styled from "styled-components";
import { ImageUploader, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import api from '../api';

/* css */
const UpdateBox = styled.div`
    .formBox {
        padding: 30px;

        .item {
            display: flex;
            align-items: center;
            height: 110px;
            line-height: 110px;
            font-size: 28px;

            .label {
                width: 20%;
                text-align: center;
            }

            .input {
                width: 80%;
            }
        }
    }

    .submit {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 70px;
        font-size: 28px;
    }
`;

const Update = function Update(props) {
    let { info, queryUserInfoAsync, navigate } = props;
    /* define status */
    let [pic, setPic] = useState([{ url: info.pic }]),
        [username, setUserName] = useState(info.name);

    /* Upload image */
    const limitImage = (file) => {
        let limit = 1024 * 1024;
        if (file.size > limit) {
            Toast.show({
                icon: 'fail',
                content: 'image must under 1 MB'
            });
            return null;
        }
        return file;
    };
    const uploadImage = async (file) => {
        let temp;
        try {
            let { code, pic } = await api.upload(file);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'Upload fail'
                });
                return;
            }
            temp = pic;
            setPic([{
                url: pic
            }]);
        } catch (_) { }
        return { url: temp };
    };

    /* Submit information */
    const submit = async () => {
        // Form check
        if (pic.length === 0) {
            Toast.show({
                icon: 'fail',
                content: 'Please upload picture'
            });
            return;
        }
        if (username.trim() === "") {
            Toast.show({
                icon: 'fail',
                content: 'Please enter account number'
            });
            return;
        }
        // 获取信息，发送请求
        let [{ url }] = pic;
        try {
            let { code } = await api.userUpdate(username.trim(), url);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'Fail to modify infomation'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: 'Success'
            });
            queryUserInfoAsync();//同步redux中的信息
            navigate(-1);
        } catch (_) { }
    };

    return <UpdateBox>
        <NavBarAgain title="Modify information" />
        <div className="formBox">
            <div className="item">
                <div className="label">Profile</div>
                <div className="input">
                    <ImageUploader
                        value={pic}
                        maxCount={1}
                        onDelete={() => {
                            setPic([]);
                        }}
                        beforeUpload={limitImage}
                        upload={uploadImage}
                    />
                </div>
            </div>
            <div className="item">
                <div className="label">Name</div>
                <div className="input">
                    <Input placeholder='Please enter the account name'
                        value={username}
                        onChange={val => {
                            setUserName(val);
                        }} />
                </div>
            </div>
            <ButtonAgain color='primary' className="submit"
                onClick={submit}>
                Submit
            </ButtonAgain>
        </div>
    </UpdateBox>;
};
export default connect(
    state => state.base,
    action.base
)(Update);