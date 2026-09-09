import { Outlet } from 'react-router-dom';
import './App.css';
import { Layout, Flex, ConfigProvider } from 'antd';
const { Header, Footer } = Layout;
//import DispatchListingPage from './pages/DispatchListingPage';

/// Need 2 sections first (3/7) with the 3-section the search section, and the 7-section
/// the list section



function App() {
  return (
    <ConfigProvider theme={{
      components: {
        Layout: {
          // headerBg: "#fff",
          // footerBg: "#fff",
          // siderBg: "#fff",
          // bodyBg: "#fff"
          headerBg: '#ff4d4f',
          siderBg: '#fff',
          footerBg: '#ad6800',
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
      <Flex className='h-screen'>
        <Layout className='overflow-hidden'>
          <Header className='text-center text-black h-16 px-12 leading-16' />
          <Outlet />
          <Footer className='text-center h-16' />
        </Layout>
      </Flex>
    </ConfigProvider>

  );
}

export default App;
