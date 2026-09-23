import { useEffect, useMemo, useState } from 'react';
import Load from '../components/Load/Load';
import { secondaryButtonClassNames } from '../components/Load/secondaryButtonClassNames';
import type { LoadProps } from '../components/Load/Load';
import { Layout, Form, Spin, Empty, Pagination, Select, Modal, Button, message } from 'antd';
import SearchFilters, { type DispatchSearchFilters } from '../components/common/SearchFilters';
import SortControl, { type SortValue } from '../components/common/SortControl';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { getDispatchBatch, buildDispatchSearchRequest, getSingleDispatch, acceptDispatch, assignDriver } from '../services/dispatchService';
import { getDrivers, type DriverOption } from '../services/driverService';
import { debounce, debounceSeek } from '../utils/debounce';
import { DollarCircleOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { fieldLabelClassName } from '../components/common/FormSection';
import { primaryButtonClassNames, selectClassNames } from '../components/common/inputStyles';
import { getProblemDetails } from '../types/ApiError';

const LoadPage = () => {
  const [form] = Form.useForm<DispatchSearchFilters>();
  const [visibleDispatches, setVisibleDispatches] = useState<LoadProps[]>([]);
  const [seekedDispatch, setSeekedDispatch] = useState<LoadProps | null>();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortValue, setSortValue] = useState<SortValue>({ field: 'createdAt', direction: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<LoadProps | null>(null);
  const [driverOptions, setDriverOptions] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    let cancelled = false;
    getDrivers()
      .then((options) => { if (!cancelled) setDriverOptions(options); })
      .catch(() => { if (!cancelled) setDriverOptions([]); })
      .finally(() => { if (!cancelled) setDriversLoading(false); });
    return () => { cancelled = true; };
  }, [modalOpen]);

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

  const runSeek = (value: string | null) => {
    setLoading(true);

    return getSingleDispatch(value)
      .then((data) => setSeekedDispatch(data))
      .catch(() =>
        setVisibleDispatches([])
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let cancelled = false;

    getDispatchBatch(buildDispatchSearchRequest(
      {
        dispatchId: null,
        dropoffDateRange: null,
        pickupDateRange: null,
        priceMax: null,
        priceMin: null,
        status: null,
        vin: null
      },
      1,
      pageSize,
      sortValue))
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
    () => debounce((values: DispatchSearchFilters, size: number, sort: SortValue) => {
      runSearch(buildDispatchSearchRequest(values, 1, size, sort));
    }, 1000),
    []
  );

  const debouncedSeek = useMemo(
    () => debounceSeek((value: string | null) => {
      runSeek(value);
    }, 1000),
    []
  );

  const handleSearch = (values: DispatchSearchFilters) => {
    setCurrentPage(1);
    debouncedSearch(values, pageSize, sortValue);
  };

  const handleDispatchIdChange = (value: string | null) => {
    if (!value) {
      setSeekedDispatch(null);
    }
    debouncedSeek(value);
  };

  const handlePageChange = (page: number, size: number) => {
    const nextPage = size !== pageSize ? 1 : page;
    setCurrentPage(nextPage);
    setPageSize(size);
    runSearch(buildDispatchSearchRequest(form.getFieldsValue(), nextPage, size, sortValue));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    form.resetFields();

    setCurrentPage(1);
    runSearch(buildDispatchSearchRequest({
      dispatchId: null,
      dropoffDateRange: null,
      pickupDateRange: null,
      priceMax: null,
      priceMin: null,
      status: null,
      vin: null
    }, 1, pageSize, sortValue));
  };

  const debouncedSortSearch = useMemo(
    () => debounce((values: DispatchSearchFilters, size: number, sort: SortValue) => {
      runSearch(buildDispatchSearchRequest(values, 1, size, sort));
    }, 1000),
    []
  );

  const handleSortChange = (nextSort: SortValue) => {
    setSortValue(nextSort);
    setCurrentPage(1);
    debouncedSortSearch(form.getFieldsValue(), pageSize, nextSort);
  };

  const handleModalOpen = (load: LoadProps) => {
    setSelectedLoad(load);
    setModalOpen(true);
    setDriverOptions([]);
    setDriversLoading(true);
    setSelectedDriverId(load.driverInfo.userId || null);
  };

  const handleAccept = async () => {
    if (!selectedLoad) return;


    try {
      setLoading(true);
      if (selectedLoad.dispatchStatus === 'NotSigned') {
        await acceptDispatch(selectedLoad.dispatchId);
        message.success('Dispatch accepted');
      } else {
        await assignDriver(selectedLoad.dispatchId, selectedDriverId!);
        message.success(selectedDriverId ? 'Driver assigned' : 'Driver unassigned');
      }
    } catch (ex) {
      const problem = getProblemDetails(ex);
      message.error(problem?.title ?? 'Failed to update dispatch');
    } finally {
      setLoading(false);
      setModalOpen(false);

      getDispatchBatch(buildDispatchSearchRequest(
        {
          dispatchId: null,
          dropoffDateRange: null,
          pickupDateRange: null,
          priceMax: null,
          priceMin: null,
          status: null,
          vin: null
        },
        1,
        pageSize,
        sortValue))
        .then(({ items, total }) => {
          setVisibleDispatches(items);
          setTotal(total);
        });
    }
  };

  const handleAcceptCancel = () => {
    setModalOpen(false);
    setSelectedLoad(null);
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
          <Load load={seekedDispatch} onModalOpen={handleModalOpen} />
        ) : (
          <div className='flex flex-col gap-3'>
            <h1 className='text-[24px] text-[rgb(0,91,168)]'>{visibleDispatches.length >= total ? total : visibleDispatches.length} of {total} Dispatches</h1>

            <div className='flex justify-between'>
              <SortControl value={sortValue} onChange={handleSortChange} />
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
              <Load key={load.dispatchId} load={load} onModalOpen={handleModalOpen} />
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
      <Modal
        open={modalOpen}
        onCancel={handleAcceptCancel}
        title={
          <h1 className='text-[20px] font-bold'>
            {selectedLoad?.dispatchStatus === 'NotSigned' ? 'Accept Load' : 'Update Status'}
          </h1>
        }
        footer={[
          <Button
            type="default"
            classNames={secondaryButtonClassNames}
            onClick={handleAcceptCancel}
          >
            Cancel
          </Button>,
          selectedLoad?.dispatchStatus === 'NotSigned' ?
            <Button
              type="primary"
              classNames={primaryButtonClassNames}
              onClick={handleAccept}
            >
              {loading ? "Accepting..." : "Accept Load"}
            </Button>
            :
            <Button
              type="primary"
              classNames={primaryButtonClassNames}
              onClick={handleAccept}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
        ]}
      >
        <div className='flex flex-col p-2 gap-2'>
          {
            selectedLoad?.dispatchStatus !== 'NotSigned' &&
            <div className='flex flex-col gap-0.5'>
              <label className={fieldLabelClassName}>Assign or Change a Driver</label>
              <Select
                classNames={selectClassNames}
                size='small'
                showSearch={{ optionFilterProp: 'label' }}
                loading={driversLoading}
                options={driverOptions}
                value={selectedDriverId}
                allowClear
                onChange={setSelectedDriverId}
                placeholder='Select a driver'
                notFoundContent={driversLoading ? 'Loading…' : 'No drivers available yet'}
                style={{ width: '100%' }}
              />
            </div>
          }
          <div className='grid grid-cols-2 gap-2'>
            <div className='border-[0.5px] gap-[2px] border-[rgb(109,109,109,0.7)] rounded-sm flex flex-col px-2 pt-2 pb-3'>
              <div className='flex items-center gap-1'>
                <DollarCircleOutlined />
                <h1 className='text-[16px] font-medium'>Load Summary</h1>
              </div>
              <div className='border-t-[0.05px] pb-2 border-[rgb(109,109,109,0.4)] w-full'></div>
              <div className='text-[20px] font-bold leading-none'>${selectedLoad?.price}</div>
              <div className='flex flex-col gap-[1px]'>
                <label className={`${fieldLabelClassName} text-[14px]`}>Pickup location</label>
                <p className='leading-none text-[14px]'>{selectedLoad?.pickupLocation}</p>
              </div>
              <div className='flex flex-col gap-[1px]'>
                <label className={`${fieldLabelClassName} text-[14px]`}>Dropoff location</label>
                <p className='leading-none text-[14px]'>{selectedLoad?.dropoffLocation}</p>
              </div>
            </div>
            <div className='border-[0.5px] gap-[2px]  border-[rgb(109,109,109,0.7)] rounded-sm flex flex-col px-2 pt-2 pb-3'>
              <div className='flex items-center gap-1'>
                <CarOutlined />
                <h1 className='text-[16px] font-medium'>Load Details</h1>
              </div>
              <div className='border-t-[0.05px] pb-2 border-[rgb(109,109,109,0.4)] w-full'></div>
              {selectedLoad && <div>
                {selectedLoad.vehicleInfo.length > 0 &&
                  <ul className='flex flex-col items-start'>
                    {selectedLoad.vehicleInfo.map((vehicle, index) => {
                      if (index < 4) {
                        return (
                          <li key={index} className='text-[14px] font-medium leading-none'>
                            {vehicle.vin.substring(0, 6)} {vehicle.year} {vehicle.make} {vehicle.model}
                          </li>
                        );
                      }
                      if (index === 4) {
                        return <li className='text-[#003468] font-bold' key={index}>+{selectedLoad.vehicleInfo.length - 4} more</li>;
                      }
                      return null;
                    })}
                  </ul>
                }
              </div>}

              <div className='flex flex-col gap-[1px]'>
                <label className={`${fieldLabelClassName} text-[14px]`}>Pickup date</label>
                <p className='leading-none text-[14px]'>{selectedLoad?.pickupDate.toLocaleDateString()}</p>
              </div>

              <div className='flex flex-col gap-[1px]'>
                <label className={`${fieldLabelClassName} text-[14px]`}>Dropoff date</label>
                <p className='leading-none text-[14px]'>{selectedLoad?.dropoffDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className='border-[0.5px] gap-[2px] border-[rgb(109,109,109,0.7)] rounded-sm flex flex-col px-2 pt-2 pb-3'>
            <div className='flex items-center gap-1'>
              <UserOutlined />
              <h1 className='text-[16px] font-medium'>Company Details</h1>
            </div>
            <div className='border-t-[0.05px] border-[rgb(109,109,109,0.4)] w-full'></div>

            <div className='flex flex-col gap-[1px]'>
              <label className={`${fieldLabelClassName} text-[14px]`}>Company name</label>
              <p className='leading-none text-[14px] text-[#003468] font-bold'>{selectedLoad?.shipperInfo.companyName}</p>
            </div>

            <div className='flex flex-col gap-[1px]'>
              <label className={`${fieldLabelClassName} text-[14px]`}>Company phone</label>
              <p className='leading-none text-[14px]'>{selectedLoad?.shipperInfo.companyPhone}</p>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default LoadPage;