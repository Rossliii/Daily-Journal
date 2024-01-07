import React, { useState, useEffect, useRef } from "react";
import HomeHead from "../components/HomeHead";
import _ from '../assets/utils';
import './Home.less';
import { Swiper, Image, Divider, DotLoading } from 'antd-mobile';
import { Link } from 'react-router-dom';
import api from '../api';
import NewsItem from "../components/NewsItem";
import SkeletonAgain from "../components/SkeletonAgain";

const Home = function Home() {
    /* Create needed status */
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
        [bannerData, setBannerData] = useState([]),
        [newsList, setNewsList] = useState([]);
    let loadMore = useRef();

    /* First rendering complete: Send data request to server*/
    useEffect(() => {
        (async () => {
            try {
                let { date, stories, top_stories } = await api.queryNewsLatest();
                setToday(date);
                setBannerData(top_stories);
                // Update news list status
                newsList.push({
                    date,
                    stories
                });
                setNewsList([...newsList]);
            } catch (_) { }
        })();
    }, []);

    /* The first rendering is complete: Set up the listener to achieve bottom loading */
    useEffect(() => {
        let ob = new IntersectionObserver(async changes => {
            let { isIntersecting } = changes[0];
            if (isIntersecting) {
                // Load more buttons appear in the viewport "that's the bottom"
                try {
                    let time = newsList[newsList.length - 1]['date'];
                    let res = await api.queryNewsBefore(time);
                    newsList.push(res);
                    setNewsList([...newsList]);
                } catch (_) { }
            }
        });
        let loadMoreBox = loadMore.current;
        ob.observe(loadMore.current);

        // When the component is destroyed and released: Manually destroy the listener
        return () => {
            ob.unobserve(loadMoreBox); //loadMore.current=null
            ob = null;
        };
    }, []);

    return <div className="home-box">
        {/* Head */}
        <HomeHead today={today} />

        {/* Slideshow */}
        <div className="swiper-box">
            {bannerData.length > 0 ? <Swiper autoplay={true} loop={true}>
                {bannerData.map(item => {
                    let { id, image, title, hint } = item;
                    return <Swiper.Item key={id}>
                        <Link to={{ pathname: `/detail/${id}` }}>
                            <Image src={image} lazy />
                            <div className="desc">
                                <h3 className="title">{title}</h3>
                                <p className="author">{hint}</p>
                            </div>
                        </Link>
                    </Swiper.Item>;
                })}
            </Swiper> : null}
        </div>

        {/* News list */}
        {newsList.length === 0 ?
            <SkeletonAgain /> :
            <>
                {
                    newsList.map((item, index) => {
                        let { date, stories } = item;
                        return <div className="news-box" key={date}>
                            {index !== 0 ? <Divider contentPosition="left">
                                {_.formatTime(date, '{1}{2}')}
                            </Divider> : null}
                            <div className="list">
                                {stories.map(cur => {
                                    return <NewsItem key={cur.id} info={cur} />;
                                })}
                            </div>
                        </div>;
                    })
                }
            </>
        }

        {/* Load more */}
        <div className="loadmore-box" ref={loadMore}
            style={{
                display: newsList.length === 0 ? 'none' : 'block'
            }} >
            <DotLoading />
            Loading
        </div>
    </div >;
};
export default Home;