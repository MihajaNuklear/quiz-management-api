/**
 * Question fields where search criteria will be applied
 */
export const QUESTION_SEARCH_FIELDS: string[] = [
  'questionAsked',
  'questionNumber'
  // 'name',
  // 'alias',
  // 'description',
  // 'groups.alias',
  
];

export const QUESTIONS_SEARCH_INDEX = 'questions-search';

export const QUESTIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH = [
  'questionNumber'
];
export const QUESTIONS_LOOKUP_STAGES = [];
