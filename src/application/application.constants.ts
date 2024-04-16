/**
 * APPLICATION fields where search criteria will be applied
 */
export const APPLICATION_SEARCH_FIELDS: string[] = [
  'user.firstname',
  'user.lastname',
  'user.username',
];

export const APPLICATIONS_SEARCH_INDEX = 'application-search';

export const APPLICATIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'user',
  'diploma',
  'motivation',
  'applicationStatus',
  'competionResult',
];
export const APPLICATIONS_LOOKUP_STAGES = [
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
];
