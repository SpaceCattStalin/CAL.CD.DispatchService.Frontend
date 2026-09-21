import { Outlet } from 'react-router-dom';
import './App.css';
import { Layout, Flex, ConfigProvider } from 'antd';
import AppHeader from './components/Layout/AppHeader';
import AppFooter from './components/Layout/AppFooter';

const { Header, Footer } = Layout;

function App() {

  return (
    <ConfigProvider theme={{
      components: {
        Layout: {
          headerBg: '#fff',
          siderBg: '#fff',
          footerBg: '#fff',
          bodyBg: '#fff',
        },
        Button: {
          colorPrimaryBgHover: '#2372B8',
          colorPrimaryBg: '#0E2E4A'
        },
        Input: {
          paddingBlock: 0,
          paddingInline: 6,
        }
      }
    }}>
      <Flex className='min-h-screen'>
        <Layout className='min-h-screen'>
          <Header className='shrink-0 text-black h-16 px-12 border-b-[6px] border-b-[#fadb14]'>
            <AppHeader />
          </Header>
          <div className='flex-1'>
            <Outlet />
          </div>
          <Footer className='shrink-0 h-16 border-t-[6px] border-t-[#fadb14]'>
            <AppFooter />
          </Footer>
        </Layout>
      </Flex>
    </ConfigProvider>
  );
}

export default App;
