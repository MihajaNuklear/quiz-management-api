/**
 * Role fields where search criteria will be applied
 */
export const STUDENT_SEARCH_FIELDS: string[] = [
  'registrationNumber',
  'user.firstname',
  'user.lastname',
  'user.username',
  'educationalClasses.name',
  'roles.alias',
  'groups.alias',
];

export const STUDENTS_SEARCH_INDEX = 'students-search';

export const STUDENTS_SEARCH_FIELDS_WITH_MONGO_SEARCH = ['firstname'];
export const STUDENTS_LOOKUP_STAGES = [
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
      from: 'educationalclasses',
      localField: 'educationalClasses',
      foreignField: '_id',
      as: 'educationalClasses',
    },
  },
  {
    $unwind: {
      path: '$educationalClasses',
      preserveNullAndEmptyArrays: true,
    },
  },
];
