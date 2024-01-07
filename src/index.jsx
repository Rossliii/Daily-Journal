import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* REDUX */
import { Provider } from 'react-redux';
import store from './store';

/* ANTD-MOBILE */
import { ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

/* Change the REM conversion ratio */
import 'lib-flexible';
import './index.less';

/* Handle maximum width */
(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById('root'),
      deviceW = html.clientWidth;
    root.style.maxWidth = "750px";
    if (deviceW >= 750) {
      html.style.fontSize = '75px';
    }
  };
  handleMax();
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);