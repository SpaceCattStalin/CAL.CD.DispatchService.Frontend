import React from 'react';
import Load from '../components/Load/Load';
import type { LoadProps } from '../components/Load/Load';
import { Layout, Form } from 'antd';
import SearchFilters, { type DispatchSearchFilters } from '../components/DipsatchListing/SearchFilters';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

const mockLoad = {
  dispatchId: 'DSP-1001',
  dispatchStatus: 'Listed',
  pickupLocation: 'Los Angeles, CA',
  pickupDate: new Date('2026-09-10'),
  dropoffLocation: 'Denver, CO',
  dropoffDate: new Date('2026-09-13'),
  carrierInfo: {
    companyId: 'CAR-2001',
    type: 'Carrier',
    companyName: 'Swift Auto Transport',
    companyPhone: '(555) 123-4567',
    companyEmail: 'dispatch@swiftautotransport.com',
  },
  driverInfo: {
    userId: 'USR-3001',
    fullName: 'John Doe',
    phone: '(555) 987-6543',
    email: 'john.doe@swiftautotransport.com',
  },
  vehicleInfo: [
    {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      color: 'Red',
      vin: '4T1BF1FK5CU123456',
    },
    {
      year: 2019,
      make: 'Honda',
      model: 'Civic',
      color: 'Blue',
      vin: '2HGFC2F59KH123456',
    },
  ],
  listingCreatedAt: new Date('2026-09-01'),
  listingUpdatedAt: new Date('2026-09-05'),
  price: 850,
} satisfies LoadProps;

const LoadPage = () => {
  const [form] = Form.useForm<DispatchSearchFilters>();

  const handleSearch = () => {
    // TODO: fetch/filter listings using _values
  };

  const handleReset = () => {
    form.resetFields();
    // TODO: reset listings back to unfiltered state
  };
  return (
    <Layout>
      <Sider width="20%" className='h-screen text-center leading-32 text-black'>
        <SearchFilters form={form} onFinish={handleSearch} onReset={handleReset} />
      </Sider>
      <Content className='p-4'>
        <Load load={mockLoad} />
      </Content>
    </Layout>
  );
};

export default LoadPage;