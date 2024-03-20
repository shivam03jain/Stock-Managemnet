import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError } from 'rxjs';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {

  registerUrl = "http://127.0.0.1:3000/api/register";
  loginUrl = "http://127.0.0.1:3000/api/login"
  addSymbolUrl = "http://127.0.0.1:3000/api/addSymbol"
  getWatchlistUrl = "http://127.0.0.1:3000/api/watchlist"
  deleteSymbolUrl = "http://127.0.0.1:3000/api/deleteSymbol"
  // getIndexUrl = "http://127.0.0.1:3000/index"
  api = "https://api.stockdata.org/v1/data/quote?symbols=AAPL%2CTSLA%2CMSFT&api_token=p4rtEFCZxoCvJysvymFetCWRfX3Oq9H3UIZUU0LW"

  constructor(private http : HttpClient, private localservice :LocalService) { }

  register(formData : FormGroup) {
    return this.http.post<any>(this.registerUrl,formData.value);
  }

  login(formData : FormGroup) {
    return this.http.post<any>(this.loginUrl,formData.value);
  }

  getWatchlist() {
    return this.http.get<{watchlist:string[]}>(this.getWatchlistUrl  + `/${this.localservice.getEmail()}`);
  }

  deleteSymbol(symbol : string) {
    return this.http.put<any>(this.deleteSymbolUrl + `/${this.localservice.getEmail()}`,{symbol : symbol })
  }

  addSymbol(formData : FormGroup) {
    console.log(formData.value);
    return this.http.put<any>(this.addSymbolUrl + `/${this.localservice.getEmail()}`,formData.value);
  }
}
