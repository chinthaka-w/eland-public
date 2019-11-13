import { Injectable } from '@angular/core';

@Injectable()
export class SystemValueService {
  // Api
  public static APP_ENDPOINT = 'api/';
  public static APP_IP = 'localhost:';
  public static APP_PROTOCOL = 'http://';
  public static APP_PORT = '9292/';

  public static readonly BASE_URL = SystemValueService.APP_PROTOCOL +
    SystemValueService.APP_IP +
    SystemValueService.APP_PORT +
    SystemValueService.APP_ENDPOINT;

  public static readonly BASE_URL2 = SystemValueService.APP_PROTOCOL +
    SystemValueService.APP_IP +
    // SystemValueService.APP_PORT +
    SystemValueService.APP_PORT;

}
