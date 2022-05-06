import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(52)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.findName(),
  company: faker.company.companyName(),
  seller: faker.address.cityName(),
  isVerified: faker.datatype.boolean(),
  date: faker.date.past(),
  category: sample([
    'Health',
    'Digital',
    'Electronics',
    'Gym',
    'Education',
    'Stationary',
  ]),
  quantity: sample([12, 15, 2, 13]),
  amount: sample([5000, 15000, 2000, 19000]),
}));

export default users;
