export enum PatternValidation {
  nameValidation = '^[.& &a-zA-Z\u0D80-\u0DFF\u0B80-\u0BFF\u200D]+$',
  nicValidation = '[0-9]{12}|[0-9]{9}[x|X|v|V]$',
  emailValidation = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}',
  contactNumberValidation = '(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\\d)\\d{6}$',
  ADDRESS_PATTERN = '^[\'$\"&\\-&.& &,&/&:&A-Za-z0-9\\U+2386\u0D80-\u0DFF\u0B80-\u0BFF\u200D\n]+$',
  FOLIO_NUMBER = '^[0-9]+/[a-zA-Z0-9]+/[0-9]+/[0-9]+',
  DAY_BOOK_NUMBER = '^[0-9]/[0-9]{1,2}/[0-9]{4}/[0-9]{6}',
<<<<<<< HEAD
=======
  PERSON_NAME_PATTERN = "^[.& &a-zA-Z\u0D80-\u0DFF\u0B80-\u0BFF\u200D]+$",
  EMAIL_PATTERN = "^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$",
  CONTACT_NUMBER_PATTERN = "^(\\+\\d{1,3}[- ]?)?\\d{10}$",
  NIC_PATTERN = "^([0-9]{9}[x|X|v|V]|[0-9]{12})$",
  WITHOUT_SPECIAL_CHARACTES_PATTERN = "^[A-Za-z0-9]+$",
  SPECIAL_CHARACTES_PATTERN = "[!@#$%^&*(),.?\":{}|<>]",
  FOLIO_CODE_PATTERN = "^([a-zA-Z]{1,9})(\/)([0-9]+)(\/)([0-9]+)$",
  DESIGNATION_PATTERN = '^[-& &,A-Za-z0-9\u0D80-\u0DFF\u0B80-\u0BFF\u200D]+$',
>>>>>>> 6bf16a7a688c79fb904469f4a749574792c083b2
}
