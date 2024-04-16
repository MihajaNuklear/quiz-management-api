/**
 * EDUCATIONALCLASSES fields where search criteria will be applied
 */
export const EDUCATIONALCLASSES_SEARCH_FIELDS: string[] = [
  'name',
  'cursus.name',
  'schoolYear',
];

export const EDUCATIONALCLASSES_SEARCH_INDEX = 'EDUCATIONALCLASSES-search';

export const EDUCATIONALCLASSES_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'user',
  'diploma',
  'motivation',
  'EDUCATIONALCLASSESStatus',
  'competionResult',
];
export const EDUCATIONALCLASSES_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'cursus',
      localField: 'cursus',
      foreignField: '_id',
      as: 'cursus',
    },
  },
  {
    $unwind: {
      path: '$cursus',
      preserveNullAndEmptyArrays: true,
    },
  },
];
