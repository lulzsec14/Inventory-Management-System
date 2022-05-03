import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

const bills = [...Array(15)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/static/mock-images/covers/cover_${index + 1}.jpg`,
  name: faker.name.findName(),
  createdAt: faker.date.past(),
  paymentMode: sample(['Cash', 'Cheque', 'NEFT', 'Online Banking']),
  transactionId: faker.datatype.uuid(),
  category: sample([
    'Health',
    'Digital',
    'Electronics',
    'Gym',
    'Education',
    'Stationary',
  ]),
  amount: faker.datatype.number(),
  quanity: faker.datatype.number(),
}));

export default bills;
