/**
 * ADMINISTRATION fields where search criteria will be applied
 */
export const ADMINISTRATION_SEARCH_FIELDS: string[] = [
  'user',
  'diploma',
  'motivation',
  'competionResult',
];

export const ADMINISTRATIONS_SEARCH_INDEX = 'administration-search';

export const ADMINISTRATIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'user',
  'diploma',
  'motivation',
  'competionResult',
];
export const ADMINISTRATIONS_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'groups',
      localField: 'user.groups',
      foreignField: '_id',
      as: 'user.groups',
    },
  },
  {
    $unwind: {
      path: '$groups',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'user.roles',
      foreignField: '_id',
      as: 'user.roles',
    },
  },
  {
    $unwind: {
      path: '$roles',
      preserveNullAndEmptyArrays: true,
    },
  },
];
