import { useEffect, useState } from 'react';
import { Form, Layout, Spin, Empty } from 'antd';
import SearchFilters from '../components/DipsatchListing/SearchFilters';
import type { DispatchSearchFilters } from '../components/DipsatchListing/SearchFilters';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import type { DispatchListingProps } from '../components/DipsatchListing/DistpatchListing';
import DispatchListing from '../components/DipsatchListing/DistpatchListing';
// import { getAllDispatches } from '../services/dispatchService';
import { filterDispatches } from '../utils/filterDispatches';

const DispatchListingPage = () => {
  const [form] = Form.useForm<DispatchSearchFilters>();
  const [allDispatches, setAllDispatches] = useState<DispatchListingProps[]>([]);
  const [visibleDispatches, setVisibleDispatches] = useState<DispatchListingProps[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let cancelled = false;

  //   getAllDispatches()
  //     .then((dispatches) => {
  //       if (cancelled) return;
  //       setAllDispatches(dispatches);
  //       setVisibleDispatches(dispatches);
  //     })
  //     .finally(() => {
  //       if (!cancelled) setLoading(false);
  //     });

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  const handleSearch = (values: DispatchSearchFilters) => {
    // setVisibleDispatches(filterDispatches(allDispatches, values));
  };

  const handleReset = () => {
    form.resetFields();
    setVisibleDispatches(allDispatches);
  };

  return (
    <Layout>
      <Sider width="20%" className='h-screen text-center leading-32 text-black'>
        <SearchFilters form={form} onFinish={handleSearch} onReset={handleReset} />
      </Sider>
      <Content className='text-center min-h-32 p-4'>
        {loading ? (
          <Spin />
        ) : visibleDispatches.length === 0 ? (
          <Empty description='No dispatches found' />
        ) : (
          <div className='flex flex-col gap-3'>
            {visibleDispatches.map((listing) => (
              <DispatchListing key={listing.dispatchId} listing={listing} />
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default DispatchListingPage;
