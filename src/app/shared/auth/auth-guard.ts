import { CanActivate } from '@angular/router';
import { SessionService } from '../service/session.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private sessionService: SessionService
      ) {
        };

    canActivate(){

        if(this.sessionService.getUser().id){
            return true;
        }
        else{
            return false;
        }
        
    }
}
