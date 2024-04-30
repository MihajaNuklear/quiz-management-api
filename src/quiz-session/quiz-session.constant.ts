/**
 * Role fields where search criteria will be applied
 */
export const QUIZ_SESSION_SEARCH_FIELDS: string[] = [
  'quizNumber'
];

export const QUIZ_SESSIONS_SEARCH_INDEX = 'quiz-session-search';

export const QUIZ_SESSIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'quizNumber'
];
export const QUIZ_SESSIONS_LOOKUP_STAGES = [
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
