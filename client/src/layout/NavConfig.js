// component
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Statistics',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Stocks',
    path: '/dashboard/stocks',
    icon: getIcon('fluent:box-16-filled'),
  },
  {
    title: 'Purchased Stocks',
    path: '/dashboard/purchasedstocks',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Sold Stocks',
    path: '/dashboard/soldstocks',
    icon: getIcon('fa6-solid:box-open'),
  },
  {
    title: 'Purchased Stocks Bill',
    path: '/dashboard/receipts',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Sold Stocks Bill',
    path: '/dashboard/bills',
    icon: getIcon('mdi:bitcoin'),
  },
  {
    title: 'Profile',
    path: '/dashboard/profile',
    icon: getIcon('clarity:administrator-solid'),
  },
];

export default navConfig;
