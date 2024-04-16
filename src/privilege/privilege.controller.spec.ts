/* eslint-disable max-lines-per-function */
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { closeInMongodConnection, generateCollectionName, mongooseTestModule } from '../core/test-utils/mongodb-test.mock';
import { Privilege, privilegeSchema } from './entities/privilege.entity';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeRepository } from './permission.repository';
import { PrivilegeService } from './privilege.service';

describe('Privilege controller', () => {
    let module: TestingModule;
    let privilegeRepository: PrivilegeRepository;
    let privilegeController: PrivilegeController;
    const privilegeCollectionName = generateCollectionName();

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                mongooseTestModule(),
                MongooseModule.forFeature([
                    {
                        name: Privilege.name,
                        schema: privilegeSchema,
                        collection: privilegeCollectionName,
                    },
                ]),
            ],
            providers: [PrivilegeRepository, PrivilegeService],
            controllers: [PrivilegeController],
        }).compile();
        privilegeRepository = module.get<PrivilegeRepository>(PrivilegeRepository);
        privilegeController = module.get<PrivilegeController>(PrivilegeController);
    }, 50000);

    it('Test module should be defined', () => {
        expect(module).toBeDefined();
    });

    it('Controller should be defined', () => {
        expect(privilegeController).toBeDefined();
    });

    afterEach(async () => {
        await privilegeRepository.model.deleteMany({}).exec();
    });

    afterAll(async () => {
        await closeInMongodConnection(module, [privilegeCollectionName]);
    });
});
