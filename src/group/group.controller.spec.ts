/* eslint-disable max-lines-per-function */

import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { closeInMongodConnection, generateCollectionName, mongooseTestModule } from '../core/test-utils/mongodb-test.mock';
import { Group, groupSchema } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

describe('GroupService', () => {
    let module: TestingModule;
    let groupController: GroupController;
    let groupRepository: GroupRepository;
    const groupCollectionName = generateCollectionName();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                mongooseTestModule(),
                MongooseModule.forFeature([{ name: Group.name, schema: groupSchema, collection: groupCollectionName }]),
            ],
            providers: [GroupService, GroupRepository],
            controllers: [GroupController],
        }).compile();
        groupController = module.get<GroupController>(GroupController);
        groupRepository = module.get<GroupRepository>(GroupRepository);
    }, 50000);

    it('Test module should be defined', () => {
        expect(module).toBeDefined();
    });

    it('Controller should be defined', () => {
        expect(groupController).toBeDefined();
    });

    afterEach(async () => {
        await groupRepository.model.deleteMany({}).exec();
    });

    afterAll(async () => {
        await closeInMongodConnection(module, [groupCollectionName]);
    });
});
