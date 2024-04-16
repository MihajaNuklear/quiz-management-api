import { Injectable } from '@nestjs/common';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { Privilege } from './entities/privilege.entity';
import { PrivilegeRepository } from './permission.repository';

/**
 * Service for Privilege layer
 */
@Injectable()
export class PrivilegeService {
  /**
   * Constructor for PrivilegeService
   * @param privilegeRepository Injected Privilege Repository
   */
  constructor(private readonly privilegeRepository: PrivilegeRepository) { }

  /**
   * Create Privilege
   * @param createPrivilegeDto Privilege which will be created
   * @returns created privilege
   */
  async create(createPrivilegeDto: CreatePrivilegeDto): Promise<Privilege> {
    return this.privilegeRepository.create(createPrivilegeDto);
  }

  /**
   * Find all Privileges
   * @returns Promise of all Privileges inside database
   */
  async findAll(): Promise<Privilege[]> {
    const privileges = await this.privilegeRepository.find({}).populate('group').exec();
    console.log("LENGTH: " + privileges.length);

    return privileges
  }

  /**
   * Find Privilege with specific id
   * @param id Id of Privilege
   * @returns Privilege corresponding to id, otherwise undefined
   */
  findOne(id: string): Promise<Privilege | undefined> {
    return this.privilegeRepository.findById(id);
  }

  async findPrivilegeNameById(id: string): Promise<String | undefined> {
    const privilege: Privilege = await this.privilegeRepository.findById(id);
    const privilegeName = privilege.name;
    return privilegeName;
  }

  /**
   * Update Privilege with specific Id
   * @param id Id of Privilege
   * @param updatePrivilegeDto Partial of Privilege containing the update
   * @returns Updated Privilege
   */
  update(
    id: string,
    updatePrivilegeDto: UpdatePrivilegeDto,
  ): Promise<Privilege> {
    return this.privilegeRepository.update(id, updatePrivilegeDto);
  }

  /**
   * Remove Privilege with specific id
   * @param id Id of Privilege
   * @returns true if deletion is successful
   */
  remove(id: string): Promise<boolean> {
    return this.privilegeRepository.delete(id);
  }

  /**
   * Search Privilege by key words included & not excluded
   * @param keywordsToInclude 
   * @param keywordsToExclude 
   * @returns 
   */
  async searchByKeywordsWithExclusion(
    keywordsToInclude: string[],
    keywordsToExclude: string[],
  ): Promise<any[]> {
    const regexKeywordsToInclude = keywordsToInclude.map(
      (keyword) => new RegExp(keyword, 'i'),
    );

    const regexKeywordsToExclude = keywordsToExclude.map(
      (keyword) => new RegExp(keyword, 'i'),
    );

    const results = await this.privilegeRepository
      .find({
        name: {
          $in: regexKeywordsToInclude,
          $not: {
            $in: regexKeywordsToExclude,
          },
        },
      })
      .exec();
    const ids = results.map((result) => result._id);
    return ids;
  }

  /**
   * search privilege by keyword 
   * @param keywordsToInclude 
   * @returns 
   */
  async searchByKeywords(keywordsToInclude: string[]): Promise<any[]> {
    const regexKeywordsToInclude = keywordsToInclude.map(
      (keyword) => new RegExp(keyword, 'i'),
    );

    const results = await this.privilegeRepository
      .find({
        name: {
          $in: regexKeywordsToInclude,
        },
      })
      .exec();

    const ids = results.map((result) => result._id);
    return ids;
  }
}
