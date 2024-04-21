import { PrivilegeName } from '../privilege/entities/privilege.entity';

/**
 * GROUP LIST NAME
 */
export const ADMIN_GROUP = 'Administration';

export const STUDENT_GROUP = 'Étudiant';

export const TEACHER_GROUP = 'Enseignant';

export const TECH_GROUP = 'Equipe technique';

export const GUEST_GROUP = 'Simple Utilisateur';

/**
 * GROUP ALIAS LIST
 */
export const ADMIN_GROUP_ALIAS = 'ADM';

export const STUDENT_GROUP_ALIAS = 'ETU';

export const TEACHER_GROUP_ALIAS = 'PED';

export const TECH_GROUP_ALIAS = 'TEC';

export const GUEST_GROUP_ALIAS = 'VIS';

/**
 *  ROLE LIST NAME
 */
export const SUPER_ADMIN_ROLE = 'Super Admin';

export const ADMIN_1_ROLE = 'Admin 1';

export const STUDENT_ROLE = 'Étudiant';

export const CANDIDATE_ROLE = 'Candidat';

export const TEACHER_ROLE = 'Enseignant';

export const TECH_ROLE = 'Technique';

export const GUEST_ROLE = 'Visiteur';

/**
 *  ROLE ALIAS LIST
 */
export const SUPER_ADMIN_ROLE_ALIAS = 'ADM';

export const ADMIN_1_ROLE_ALIAS = 'ADM1';

export const STUDENT_ROLE_ALIAS = 'ETU';

export const CANDIDATE_ROLE_ALIAS = 'CDT';

export const TEACHER_ROLE_ALIAS = 'ENS';

export const TECH_ROLE_ALIAS = 'TEC';

export const GUEST_ROLE_ALIAS = 'VIS';

/**
 INITIAL Cursus
*/
export const CURSUS_INITIAL = [
  {
    name: 'Génie Logiciel',
    description: 'Branche  axée sur le développement de logiciels.',
  },
  {
    name: 'Administration Système et Réseaux',
    description: 'Branche axée sur la gestion des réseaux informatiques.',
  },
];

/*
 GROUP INSERT TO PRIVILEGES
 */

export const privilegeWithItsGroup = [
  {
    privilege: PrivilegeName.VIEW_PROFILE,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },
  {
    privilege: PrivilegeName.EDIT_PROFILE,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.VIEW_EVENT,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.CREATE_EVENT,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_EVENT,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_EVENT,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_APPLICATION,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_APPLICATION,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.EDIT_APPLICATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_APPLICATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_USER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_USER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_USER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_USER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_GROUP,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_GROUP,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_GROUP,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_GROUP,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_ROLE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_ROLE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_ROLE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_ROLE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_COURSE,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_COURSE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_COURSE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_COURSE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_CURSUS,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_CURSUS,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_CURSUS,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_CURSUS,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_TEACHER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_TEACHER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_TEACHER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_TEACHER,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_PRIVILEGE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_PRIVILEGE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_PRIVILEGE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_PRIVILEGE,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_ADMINISTRATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_ADMINISTRATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_ADMINISTRATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_ADMINISTRATION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_STUDENT,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_STUDENT,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_STUDENT,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_STUDENT,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_EDUCATIONAL_CLASSES,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_EDUCATIONAL_CLASSES,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_EDUCATIONAL_CLASSES,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_EDUCATIONAL_CLASSES,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_MAIL,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.CREATE_MAIL,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_MAIL,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_MAIL,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_COMMENT,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.CREATE_COMMENT,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_COMMENT,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_COMMENT,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_HISTORY,
    groups: [ADMIN_GROUP, STUDENT_GROUP, TEACHER_GROUP, TECH_GROUP],
  },

  {
    privilege: PrivilegeName.CREATE_HISTORY,
    groups: [ADMIN_GROUP, STUDENT_GROUP, TEACHER_GROUP, TECH_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_HISTORY,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.DELETE_HISTORY,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_SETTING,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_QUIZ_SESSION,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },
  {
    privilege: PrivilegeName.CREATE_QUIZ_SESSION,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },

  {
    privilege: PrivilegeName.EDIT_QUIZ_SESSION,
    groups: [ADMIN_GROUP],
  },
  {
    privilege: PrivilegeName.DELETE_QUIZ_SESSION,
    groups: [ADMIN_GROUP],
  },

  {
    privilege: PrivilegeName.VIEW_QUESTION,
    groups: [
      ADMIN_GROUP,
      STUDENT_GROUP,
      TEACHER_GROUP,
      TECH_GROUP,
      GUEST_GROUP,
    ],
  },
  {
    privilege: PrivilegeName.CREATE_QUESTION,
    groups: [ADMIN_GROUP, TEACHER_GROUP],
  },

  {
    privilege: PrivilegeName.EDIT_QUESTION,
    groups: [ADMIN_GROUP],
  },
  {
    privilege: PrivilegeName.DELETE_QUESTION,
    groups: [ADMIN_GROUP],
  },
];
