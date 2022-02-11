import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { concat, fromEvent, interval, merge, Observable, of, zip } from 'rxjs';
import { map, catchError, filter, mergeMap, switchMap, switchAll, mergeAll, concatAll, tap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  output = '';
  @ViewChild('fire') fireButton!: ElementRef<HTMLButtonElement>;
  
  private observable$!: Observable<any>;
  private eventObservable$!: Observable<any>;

  ngAfterViewInit(): void {
    let counter = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVQWXYZ";

    this.eventObservable$ = fromEvent(this.fireButton.nativeElement, 'click').pipe(
      map(e => letters[counter++]),
      tap(l => {if (l === 'E') throw 'Eek!'})
    );  

    let obsOfObs$ = this.eventObservable$.pipe(
      map(l => interval(500).pipe(map(n => `${l}${n}`)))
    )

    this.observable$ = obsOfObs$.pipe(switchAll());
  }

  start(): void{
    this.observable$.pipe(
       catchError(e => of(`Error: ${e}`))
    ).subscribe(
      n => this.output =`${this.output} ${n}`
    )
  }
}
