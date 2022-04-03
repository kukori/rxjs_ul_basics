import { Observable, fromEvent, of, from, interval } from 'rxjs';
import { map, pluck, mapTo, filter, reduce, take, scan, tap } from 'rxjs/operators';

const observer = {
    next: (value: any) => console.log('next', value),
    error: (error: Error) => console.log('error', error),
    complete: () => console.log('complete!'),
}

const observable = new Observable(subscriber => {
    let count = 0;

    const id = setInterval(() => {
        subscriber.next(count);
        count += 1;
    }, 1000);

    return () => {
        console.log('clearinterval called')
        clearInterval(id);
    }
}) 

// const subscription = observable.subscribe(
//     //observer here
//     observer
// )

// setTimeout(() => {
//     subscription.unsubscribe();
// }, 3500);



// fromEvent
const source = fromEvent(document, 'click');

// source.subscribe(
//     observer
// )

// of (events emitted syncronously)
const sourceOf = of(1,2,3,4,5)

// sourceOf.subscribe(observer)

// from
const sourceFrom = from([1,2,3,4,5])
// const sourceFrom = from(fetch('https://api.github.com/users/octocat'));

// sourceFrom.subscribe(observer)


//interval
const timer = interval(1000)

// timer.subscribe(console.log)

// MAP:
of(2,3,4,5,6).pipe(
    map(value => value * 10)
)
// .subscribe(console.log)

const keyup = fromEvent(document, 'keyup');
const keyCode = keyup.pipe(
    map((value: KeyboardEvent) => value.code)
)

const keyCodeWithPluck = keyup.pipe(
    //pluck extracts the property name from the object
    pluck('code')
)
const pressed = keyup.pipe(
    mapTo('Key pressed!')
)


// keyCodeWithPluck.subscribe(console.log)


// FILTER:
of(3,4,5,6,7,8,9).pipe(
    filter(value => value > 6)
)
// .subscribe(console.log)

const enters = keyCode.pipe(
    filter(code => code === 'Enter')
)

// enters.subscribe(console.log)

// REDUCE:
const numbers = [1,2,3,4,5];
const totalReducer = (accumlator: number, currentValue: number) => {
    return accumlator + currentValue;
}

// console.log(numbers.reduce(totalReducer, 0))

// from(numbers).pipe(
//     reduce(totalReducer, 0)
// ).subscribe(console.log)

// reduce only emmits the final value, if yiy
// interval(1000).pipe(
//     take(3),
//     reduce(totalReducer, 0)
// ).subscribe({
//     next: console.log,
//     complete: () => console.log('Complete!')
// })

// from(numbers).pipe(
//     scan((accumlator, current) => {
//         return accumlator + current;
//     }, 0)
// ).subscribe(console.log)

//countdown from 9
const counter = interval(1000);

counter.pipe(
    scan((accumlator, current) => {
        return accumlator - 1;
    }, 10),
    filter(value => value >= 0)
)
// .subscribe(console.log);

// TAP:
from(numbers).pipe(
    tap(value => { console.log('before', value)}),
    map(value => value * 10),
    tap({
        next: value => { console.log('after', value)},
        complete: () =>  console.log('done'),
        error: error => { console.log(error)},
    }),
)
// .subscribe(value => {
//     console.log('from subscribe', value)
// })