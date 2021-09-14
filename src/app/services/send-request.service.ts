import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SendRequestService {
  public static baseUrl:string = 'https://localhost:5001/api/v1/';
  public static async sendRequest(
    url: string,
    method: string,
    hasJson: boolean,
    body?: object
  ): Promise<any> {

    const init: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    init.method = method;
    if (body) {
      
      init.body = JSON.stringify(body);
    }
    //TODO ino taghir dadam havestoon bashe ;)
    return fetch(this.baseUrl+url, init).then((res) => {
      if (res.ok) {
        if (hasJson) return res.json();
        return;
      }
      throw res.json();
    });
  }
}
