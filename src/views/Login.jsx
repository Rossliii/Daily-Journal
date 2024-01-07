import React, { useState, useEffect } from 'react';
import { Form, Input, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../store/action';
import './Login.less';
import ButtonAgain from '../components/ButtonAgain';
import NavBarAgain from '../components/NavBarAgain';
import api from '../api';
import _ from '../assets/utils';

/* 自定义表单校验规则 */
const validate = {
    phone(_, value) {
        value = value.trim();
        let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
        if (value.length === 0) return Promise.reject(new Error('手机号是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('手机号格式有误!'));
        return Promise.resolve();
    },
    code(_, value) {
        value = value.trim();
        let reg = /^\d{6}$/;
        if (value.length === 0) return Promise.reject(new Error('验证码是必填项!'));
        if (!reg.test(value)) return Promise.reject(new Error('验证码格式有误!'));
        return Promise.resolve();
    }
};

const Login = function Login(props) {
    let { queryUserInfoAsync, navigate, usp } = props;

    /* 状态 */
    const [formIns] = Form.useForm(),
        [disabled, setDisabled] = useState(false),
        [sendText, setSendText] = useState('发送验证码');

    /* 表单提交 */
    const submit = async () => {
        try {
            await formIns.validateFields();
            let { phone, code } = formIns.getFieldsValue();
            let { code: codeHttp, token } = await api.login(phone, code);
            if (+codeHttp !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '登录失败'
                });
                formIns.resetFields(['code']);
                return;
            }
            // 登录成功:存储Token、存储登录者信息到redux、提示、跳转
            _.storage.set('tk', token);
            await queryUserInfoAsync(); //派发任务,同步redux中的状态信息
            Toast.show({
                icon: 'success',
                content: '登录/注册成功'
            });
            let to = usp.get('to');
            to ? navigate(to, { replace: true }) : navigate(-1);
        } catch (_) { }
    };

    /* 发送验证码 */
    let timer = null,
        num = 31;
    const countdown = () => {
        num--;
        if (num === 0) {
            clearInterval(timer);
            timer = null;
            setSendText(`Send CAPTCHA`);
            setDisabled(false);
            return;
        }
        setSendText(`After ${num}`);
    };
    const send = async () => {
        try {
            await formIns.validateFields(['phone']);
            let phone = formIns.getFieldValue('phone');
            let { code } = await api.sendPhoneCode(phone);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'Fail'
                });
                return;
            }
            // send successfully
            setDisabled(true);
            countdown();
            if (!timer) timer = setInterval(countdown, 1000);
        } catch (_) { }
    };
    // When the component is destroyed: Kill the timer that is not cleared
    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, []);

    return <div className='login-box'>
        <NavBarAgain title="log in/sign up" />
        <Form
            layout='horizontal'
            style={{ '--border-top': 'none' }}
            footer={
                <ButtonAgain color='primary'
                    onClick={submit}>
                    submit
                </ButtonAgain>
            }
            form={formIns}
            initialValues={{ phone: '', code: '' }}
        >
            <Form.Item name='phone' label='Phone number' rules={[{ validator: validate.phone }]}>
                <Input placeholder='Please enter phone number' />
            </Form.Item>

            <Form.Item name='code' label='CAPTCHA'
                rules={[{ validator: validate.code }]}
                extra={
                    <ButtonAgain size='small' color='primary'
                        disabled={disabled}
                        onClick={send}>
                        {sendText}
                    </ButtonAgain>
                }
            >
                <Input />
            </Form.Item>
        </Form>
    </div>;
};
export default connect(
    null,
    action.base
)(Login);
