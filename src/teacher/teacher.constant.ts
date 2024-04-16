/**
 * Role fields where search criteria will be applied
 */
export const TEACHER_SEARCH_FIELDS: string[] = [
  'user.firstname',
  'user.lastname',
  'user.username',
  'roles.alias',
  'groups.alias',
  'email',
];

export const TEACHERS_SEARCH_INDEX = 'teachers-search';

export const TEACHERS_SEARCH_FIELDS_WITH_MONGO_SEARCH = ['description', 'name'];
export const TEACHERS_LOOKUP_STAGES = [
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
