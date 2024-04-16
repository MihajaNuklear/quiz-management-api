/**
 * COURSE fields where search criteria will be applied
 */
export const COURSE_SEARCH_FIELDS: string[] = [
  'name',
  'code',
  'teacher.user.firstname',
  'semester',
];

export const COURSES_SEARCH_INDEX = 'courses-search';

export const COURSES_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'name',
  'code',
  'teacher',
  'semester',
];

export const COURSE_LOOKUP_STAGES = [
  {
    $lookup: {
      from: 'teachers',
      localField: 'teacher',
      foreignField: '_id',
      as: 'teacher',
    },
  },
  {
    $unwind: {
      path: '$teacher',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'teacher.user',
      foreignField: '_id',
      as: 'teacher.user',
    },
  },
  {
    $unwind: {
      path: '$teacher.user',
      preserveNullAndEmptyArrays: true,
    },
  },
];
