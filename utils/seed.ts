import { User } from "@prisma/client";
import Chance from "chance";
import { logger } from "./logger";
import { ObjectId } from "mongodb";
import { prisma } from "../dist/prisma/prisma";

const chance = new Chance();

interface SeedUser extends Omit<User, "role"> {}

const createUser = (): SeedUser => {
  return {
    id: new ObjectId().toHexString(),
    email: chance.email(),
    firstName: chance.name(),
    lastName: chance.name(),
  };
};
const generateUsers = (): SeedUser[] => {
  return chance.n(createUser, chance.integer({ min: 2, max: 5 }));
};

const seed = async (): Promise<void> => {
  const users = generateUsers();
  try {
    await prisma.user.createMany({
      data: users,
    });
    logger.info("Successfully seeded database");
  } catch (e) {
    logger.error(`An Error occurred when attempting to seed db: ${e}`);
  }
};

seed();
