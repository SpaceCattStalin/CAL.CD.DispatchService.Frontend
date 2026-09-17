import { useEffect, useMemo, useState } from 'react';
import Load from '../components/Load/Load';
import type { LoadProps } from '../components/Load/Load';
import { Layout, Form, Spin, Empty, Pagination, Select } from 'antd';
import SearchFilters, { type DispatchSearchFilters } from '../components/common/SearchFilters';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { getDispatchBatch, buildDispatchSearchRequest, getSingleDispatch } from '../services/dispatchService';
import { debounce, debounceSeek } from '../utils/debounce';

const LoadPage = () => {
  const [form] = Form.useForm<DispatchSearchFilters>();
  const [visibleDispatches, setVisibleDispatches] = useState<LoadProps[]>([]);
  const [seekedDispatch, setSeekedDispatch] = useState<LoadProps>();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);


  const runSearch = (request: ReturnType<typeof buildDispatchSearchRequest>) => {
    setLoading(true);

    return getDispatchBatch(request)
      .then(({ items, total }) => {
        setVisibleDispatches(items);
        setTotal(total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;

    getDispatchBatch(buildDispatchSearchRequest({}, 1, pageSize))
      .then(({ items, total }) => {
        if (cancelled) return;
        setVisibleDispatches(items);
        setTotal(total);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((values: DispatchSearchFilters, size: number) => {
      runSearch(buildDispatchSearchRequest(values, 1, size));
    }, 1000),
    []
  );

  const debouncedSeek = useMemo(
    () => debounceSeek((value: string | undefined) => {
      setLoading(true);

      getSingleDispatch(value)
        .then((data) => setSeekedDispatch(data))
        .finally(() => setLoading(false));
    }, 1000),
    []
  );

  const handleSearch = (values: DispatchSearchFilters) => {
    setCurrentPage(1);
    debouncedSearch(values, pageSize);
  };

  const handleDispatchIdChange = (value: string | undefined) => {
    if (!value) {
      setSeekedDispatch(undefined);
      return;
    }
    debouncedSeek(value);
  };

  const handlePageChange = (page: number, size: number) => {
    const nextPage = size !== pageSize ? 1 : page;
    setCurrentPage(nextPage);
    setPageSize(size);
    runSearch(buildDispatchSearchRequest(form.getFieldsValue(), nextPage, size));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentPage(1);
    runSearch(buildDispatchSearchRequest({}, 1, pageSize));
  };

  return (
    <Layout>
      <Sider width="20%" className='min-h-screen text-center leading-32 text-black'>
        <SearchFilters form={form} onFinish={handleSearch} onReset={handleReset} onDispatchIdChange={handleDispatchIdChange} />
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
        ) : seekedDispatch ? (
          <Load load={seekedDispatch} />
        ) : (
          <div className='flex flex-col gap-3'>
            <div className='flex justify-between'>
              <h1 className='text-[24px] text-[rgb(0,91,168)]'>{pageSize >= total ? total : pageSize} of {total} Dispatches</h1>
              <Select
                value={pageSize}
                onChange={(size) => handlePageChange(currentPage, size)}
                options={[
                  { value: 10, label: '10 / page' },
                  { value: 20, label: '20 / page' },
                  { value: 50, label: '50 / page' },
                ]}
                style={{ width: 120 }}
              />
            </div>
            {visibleDispatches.map((load) => (
              <Load key={load.dispatchId} load={load} />
            ))}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              className='self-center mt-2'
            />
          </div>
        )}
      </Content>
    </Layout >
  );
};

export default LoadPage;