import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Country, Currency, Language } from 'src/app/types/api';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  country: Observable<Country>;
  borderCountries: Observable<Country[]> | Observable<any[]>;
  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.country = this.api.getCountryByName(params.country).pipe(
        tap((res) => res),
        // mergeMap operator is best used when you wish to flatten an
        // inner observable but want to manually control the number of inner subscriptions.
        mergeMap((res) => {
          this.borderCountries = this.api.getCountryByCodes(res.borders);
          // of returns an Observable that emits the arguments described above and then completes.
          return of(res);
        })
      );
    });
  }

  displayCurrencies(currencies: Currency[]) {
    return currencies.map((currency) => currency.name).join(', ');
  }

  displayLanguages(languages: Language[]) {
    return languages.map((language) => language.name).join(', ');
  }
}
