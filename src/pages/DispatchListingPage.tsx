import { Form, Layout } from 'antd';
import SearchFilters from '../components/DipsatchListing/SearchFilters';
import type { DispatchSearchFilters } from '../components/DipsatchListing/SearchFilters';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import type { DispatchListingProps } from '../components/DipsatchListing/DistpatchListing';
import DispatchListing from '../components/DipsatchListing/DistpatchListing';

const mockListing = {
  dispatchId: 'DSP-1001',
  dispatchStatus: 'Listed',
  pickupLocation: 'Los Angeles, CA',
  pickupDate: new Date('2026-09-10'),
  dropoffLocation: 'Denver, CO',
  dropoffDate: new Date('2026-09-13'),
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
} satisfies DispatchListingProps;

const DispatchListingPage = () => {
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
      <Sider width="15%" className='text-center leading-32 text-black'>
        <SearchFilters form={form} onFinish={handleSearch} onReset={handleReset} />
      </Sider>
      <Content className='text-center min-h-32 p-4'>
        <DispatchListing listing={mockListing} />
      </Content>
    </Layout>
  );
};

export default DispatchListingPage;