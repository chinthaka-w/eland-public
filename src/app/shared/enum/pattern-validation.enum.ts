export enum PatternValidation {
  nameValidation = '^[a-zA-Z\\s-]+$',
  nicValidation = '[0-9]{12}|[0-9]{9}[x|X|v|V]$',
  emailValidation = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}',
  contactNumberValidation = '(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|5|6|7|8)\\d)\\d{6}$',
}
