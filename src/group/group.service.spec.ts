/* eslint-disable max-lines-per-function */

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  generateCollectionName,
  mongooseTestModule,
} from '../core/test-utils/mongodb-test.mock';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, groupSchema } from './entities/group.entity';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let module: TestingModule;
  let groupService: GroupService;
  let groupRepository: GroupRepository;
  const groupCollectionName = generateCollectionName();

  const toBeCreatedGroup: CreateGroupDto = {
    description: 'Group for testing purpose',
    name: 'Group name for test',
  };

  const groups: CreateGroupDto[] = [
    toBeCreatedGroup,
    {
      description: 'another group description',
      name: 'created group name 2',
    },
  ];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: Group.name,
            schema: groupSchema,
            collection: groupCollectionName,
          },
        ]),
      ],
      providers: [GroupService, GroupRepository],
    }).compile();
    groupService = module.get<GroupService>(GroupService);
    groupRepository = module.get<GroupRepository>(GroupRepository);
  }, 500000);

  it('Test module should be defined', () => {
    expect(module).toBeDefined();
  });

  it('Should create group', async () => {
    await groupService.create(toBeCreatedGroup);
    const result = await groupRepository
      .findOne({ name: toBeCreatedGroup.name })
      .exec();
    expect(result.name).toEqual(toBeCreatedGroup.name);
  });

  it('Should find created Group', async () => {
    const createdGroup = await groupService.create(toBeCreatedGroup);
    const result = await groupService.findOne(createdGroup._id as string);
    expect(result.name).toEqual(toBeCreatedGroup.name);
  });

  it('Should find all privileges', async () => {
    for (const group of groups) {
      await groupService.create(group);
    }
    const results: Group[] = await groupService.findAll();
    for (let i = 0; i < results.length; i++) {
      expect(results[i].name).toEqual(groups[i].name);
      expect(results[i].description).toEqual(groups[i].description);
    }
  });

  it('Group update should be effective', async () => {
    const expectedDescription = 'updated description';
    const inDatabaseCreatedGroup = await groupService.create(toBeCreatedGroup);
    await groupService.update(inDatabaseCreatedGroup._id as string, {
      description: expectedDescription,
    });
    const result = await groupService.findOne(
      inDatabaseCreatedGroup._id as string,
    );
    expect(result.description).toEqual(expectedDescription);
  });

  it('Remove group should be effective', async () => {
    const inDatabaseCreatedGroup = await groupService.create(toBeCreatedGroup);
    expect(await groupRepository.count({})).toEqual(1);
    await groupService.remove(inDatabaseCreatedGroup._id as string);
    expect(await groupRepository.count({})).toEqual(0);
  });

  afterEach(async () => {
    await groupRepository.model.deleteMany({}).exec();
  });

  afterAll(async () => {
    await closeInMongodConnection(module, [groupCollectionName]);
  });
});
