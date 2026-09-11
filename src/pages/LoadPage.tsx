import { useEffect, useMemo, useState } from 'react';
import Load from '../components/Load/Load';
import type { LoadProps } from '../components/Load/Load';
import { Layout, Form, Spin, Empty } from 'antd';
import SearchFilters, { type DispatchSearchFilters } from '../components/DipsatchListing/SearchFilters';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { getDispatchBatch, buildDispatchSearchRequest } from '../services/dispatchService';
import { debounce } from '../utils/debounce';

const LoadPage = () => {
  const [form] = Form.useForm<DispatchSearchFilters>();
  const [allDispatches, setAllDispatches] = useState<LoadProps[]>([]);
  const [visibleDispatches, setVisibleDispatches] = useState<LoadProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDispatchBatch(buildDispatchSearchRequest({}))
      .then((dispatches) => {
        if (cancelled) return;
        setAllDispatches(dispatches);
        setVisibleDispatches(dispatches);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((values: DispatchSearchFilters) => {
        setLoading(true);

        getDispatchBatch(buildDispatchSearchRequest(values))
          .then((data) => setVisibleDispatches(data))
          .finally(() => setLoading(false));
      }, 1000),
    []
  );

  const handleSearch = (values: DispatchSearchFilters) => {
    debouncedSearch(values);
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
      <Content className='p-4'>
        {loading ? (
          <div className='flex items-center justify-center self-stretch h-full'>
            <Spin size='large' />
          </div>
        ) : visibleDispatches.length === 0 ? (
          <div className='flex items-center justify-center self-stretch h-full'>
            <Empty description='No dispatches found' />
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {visibleDispatches.map((load) => (
              <Load key={load.dispatchId} load={load} />
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default LoadPage;
