
export const USER_REGEX = /^[A-z 0-9]{6,20}$/;
export const COMMENT_REGEX = /^[A-z .:,?!@-_ 0-9]{0,150}$/;
export const SHORTCOMMENT_REGEX = /^[A-z .:,?!@-_ 0-9]{0,30}$/;
export const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/;
export const OBJECTID_REGEX = /^[A-z 0-9]{24}$/;
export const PHONE_REGEX = /^[0-9-]{6,15}$/;
export const DATE_REGEX = /^[0-9\/-]{7,10}$/
export const EMAIL_REGEX = /^[A-z0-9.@-_]{6,25}$/;
export const FEE_REGEX = /^(0|[1-9][0-9]{0,3})(\.[0-9]{0,3})?$/;
export const NAME_REGEX = /^[A-z 0-9']{3,25}$/;
export const NUMBER_REGEX = /^[0-9]{1,4}(\.[0-9]{0,3})?$/;
export const SMALLNUMBER_REGEX = /^[0-9]{1,4}$/;
export const YEAR_REGEX = /^[0-9]{4}\/[0-9]{4}$/;
export const TITLE_REGEX = /^[A-z/ 0-9]{8,20}$/;