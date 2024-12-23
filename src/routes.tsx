import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, Layout } from 'antd';
import { HeaderPage } from "./components/Header";
import { FooterPage } from "./components/Footer";
import Games from "./components/Games";
import Game from "./components/Game";

const { Content } = Layout;

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: '#fe0080',
              colorPrimaryHover: '#fe66b2',
              defaultBg: '#75C225',
              defaultBorderColor: '#75C225',
              defaultColor: '#ffffff',
              defaultHoverColor: '#ffffff',
              defaultHoverBorderColor: '#75C225',
              defaultHoverBg: 'rgba(117,194,37,0.8)',
              fontWeight: 600
            },
            Menu: {
              itemColor: '#111111',
              horizontalItemSelectedColor: '#fe0080',
              itemActiveBg: '#fe0080',

            },
            Alert: {
              colorInfo: '#fe0080',
              colorInfoBg: '#ffe6ee',
              colorInfoBorder: '#ff7aaf'
            },
            Card: {
              headerFontSize: 36,
              fontWeightStrong: 400,
              boxShadow: '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
              
            },
            Layout: {
              headerBg: 'transparent',
              headerColor: '#111111',
              headerHeight: 100,
              footerBg: '#25252a',
              footerPadding: '42px 50px'
            }
          },
          token: {
            fontFamily: "'Open Sans', -apple - system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans- serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
            colorBgLayout: '#ffffff',
            colorText: '#666666',
            colorLink: '#fe0080',
            colorTextHeading: '#111111',
            borderRadius: 4,
            colorBorder: '#FF9191',
            boxShadow: '0 1px 2px -2px rgba(248,66,66, 0.16), 0 3px 6px 0 rgba(248,66,66, 0.12), 0 5px 12px 4px rgba(248,66,66, 0.09)',
            fontSizeHeading1: 96,
            fontSizeHeading2: 48,
            colorError: '#ee1911',
          }
        }}
      >
        <Layout>
          <HeaderPage />
          <Content>
            <Routes>
              <Route  path="/" element={<Games />} />
              <Route  path="/games" element={<Games />} />
              <Route  path="/games/:gameId" element={<Game />} />                
            </Routes>
          </Content>
          <FooterPage />
        </Layout>
      </ConfigProvider> 
    </BrowserRouter>)
}

export default App;
