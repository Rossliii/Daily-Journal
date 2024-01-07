import React, { useMemo, useEffect } from "react";
import timg from '../assets/images/timg.jpg';
import './HomeHead.less';
import { connect } from 'react-redux';
import action from '../store/action';
import { useNavigate } from 'react-router-dom';

const HomeHead = function HomeHead(props) {
    const navigate = useNavigate();

    /* calculate month and year */
    let { today, info, queryUserInfoAsync } = props;
    let time = useMemo(() => {
        let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/);
        return {
            month: area[+month],
            day
        };
    }, [today]);

    // After the first rendering: If there is no information in info, we try to distribute it once to get the login information
    useEffect(() => {
        if (!info) {
            queryUserInfoAsync();
        }
    }, []);

    return <header className="home-head-box">
        <div className="info">
            <div className="time">
                <span>{time.day}</span>
                <span>{time.month}</span>
            </div>
            <h2 className="title">知乎日报</h2>
        </div>

        <div className="picture"
            onClick={() => {
                navigate('/personal');
            }}>
            <img src={info ? info.pic : timg} alt="" />
        </div>
    </header>;
};
export default connect(
    state => state.base,
    action.base
)(HomeHead);