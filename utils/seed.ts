import Chance from 'chance';
import { logger } from './logger';
import { ObjectId } from 'mongodb';
import { PrismaClient } from '../dist/prisma/index';

const chance = new Chance();
const prisma = new PrismaClient();

const generateBusinesses = () => {
  return chance.n(
    async () => {
      return await prisma.business.create({
        data: {
          id: new ObjectId().toHexString(),
          name: chance.company(),
          address: {
            create: {
              addressLine1: chance.address(),
              city: chance.city(),
              state: chance.state()
            }
          }
        },
        include: {
          address: true
        }
      });
    },
    chance.integer({ min: 2, max: 4 })
  );
};

const generateUsers = () => {
  return chance.n(
    async () => {
      return await prisma.user.create({
        data: {
          id: new ObjectId().toHexString(),
          email: chance.email(),
          firstName: chance.first(),
          lastName: chance.last(),
          artist: {
            create: {
              email: chance.email()
            }
          }
        }
      });
    },
    chance.integer({ min: 2, max: 5 })
  );
};

const seed = async (): Promise<void> => {
  try {
    const businessPromises = generateBusinesses();
    const userPromises = generateUsers();

    await Promise.all(businessPromises);
    await Promise.all(userPromises);

    logger.info('Successfully seeded database');
  } catch (e) {
    logger.error(`An Error occurred when attempting to seed db: ${e}`);
  }
};

seed();
