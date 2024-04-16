/**
 * Role fields where search criteria will be applied
 */
export const ROLE_SEARCH_FIELDS: string[] = [
  'name',
  'alias',
  'description',
  'groups.alias',
];

export const ROLES_SEARCH_INDEX = 'roles-search';

export const ROLES_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'name',
  'alias',
  'description',
  'groups.alias',
];
export const ROLES_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'privileges',
      localField: 'privileges',
      foreignField: '_id',
      as: 'privileges',
    },
  },
  {
    $unwind: {
      path: '$privilege',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'groups',
      localField: 'groups',
      foreignField: '_id',
      as: 'groups',
    },
  },
  {
    $unwind: {
      path: '$group',
      preserveNullAndEmptyArrays: true,
    },
  },
];
