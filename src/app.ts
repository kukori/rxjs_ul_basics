import { Observable, fromEvent, timer, empty, of, from, interval } from 'rxjs';
import { map, pluck, mapTo, filter, reduce, 
    take, scan, tap, first, takeWhile, 
    takeUntil, distinctUntilChanged,
    debounceTime, debounce, throttleTime,
    sampleTime, sample, auditTime,
    mergeAll, mergeMap, switchMap,
    concatMap, exhaustMap, catchError,
    delay, mergeMapTo, finalize, switchMapTo,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax'

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
const intervalTimer = interval(1000)

// intervalTimer.subscribe(console.log)

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
    // tap(console.log),
    //filter(value => value > 0)
    // takeWhile is better in this case bc filter does not stop the interval
    takeWhile(value => value > 0)
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

// TAKE:
const numbers2 = of(1,2,3,4,5);
const click = fromEvent(document, 'click');

click.pipe(
    map((event: MouseEvent) => ({
        x: event.clientX,
        y: event.clientY
    })),
    // take(1)
    // first is like take but only accepts according to a condition
    // first(({y}) => y > 200)
    takeWhile(({y}) => y <= 200)
)
// .subscribe({
//     next: console.log,
//     complete: () => console.log("completed")
// });


// TAKEUNTIL:
counter.pipe(
    takeUntil(click)
)
// .subscribe({
//     next: console.log,
//     complete: () => console.log("completed")
// });


// DISTINCTUNTILCHANGED:
const numbers3 = of(1,1,2,3,3,3,4,5,3);
// compares to the last value so the last 3 will be shown

numbers3.pipe(
    distinctUntilChanged()
)
// .subscribe({
//     next: console.log,
//     complete: () => console.log("completed")
// });

const inputBox = document.getElementById('text-input');
const input = fromEvent(inputBox, 'keyup')

// DEBOUNCETIME:
input.pipe(
    // debounceTime(1000),
    // same as debouncetime
    debounce(() => interval(1000)),
    pluck('target', 'value'),
    distinctUntilChanged(),
    switchMap((searchTerm: string) => {
        return ajax.getJSON(`https://api.openbrewerydb.org/breweries?by_name=${searchTerm}`)
        .pipe(
            catchError((error: Error) => {
                console.log(error)
                return empty();
            })
        )
    })
)
// .subscribe(console.log);

// THROTTLETIME:
click.pipe(
    // let's through a click event every 3s
    //throttleTime(3000)
    //sampleTime(4000),
    // auditTime is the same as sampleTime but samples the triling edge
    auditTime(4000),
    map(({clientX, clientY}: MouseEvent) => ({
        clientX, clientY
    }))
)
// .subscribe(console.log)

intervalTimer.pipe(
    sample(click)
)
// .subscribe(console.log)



// STREAMS: 
input.pipe(
    // map((event: any) => {
    //     const term = event.target.value;
    //     return ajax.getJSON(
    //         `https://api.github.com/users/${term}`
    //     )
    // }),
    // debounceTime(1000),
    // mergeAll()
    debounceTime(1000),
    mergeMap((event: any) => {
        const term = event.target.value;
        return ajax.getJSON(
            `https://api.github.com/users/${term}`
        )
    }),
)
// .subscribe(console.log)

const interval1 = interval(1000);

// on click 
click.pipe(
    mergeMap(() => interval1)
)
// .subscribe(console.log) 

const mouseDown = fromEvent(document, 'mousedown');
const mouseUp = fromEvent(document, 'mouseup');

mouseDown.pipe(
    mergeMap(() => interval1.pipe(
        takeUntil(mouseUp)
    ))
)
// .subscribe({
//     next: console.log,
//     complete: () => console.log("completed")
// });

const coordinates = click.pipe(
    map((event: MouseEvent) => ({
        x: event.clientX,
        y: event.clientY
    })),
);

const coordinatesWithSave = coordinates.pipe(
    mergeMap(cordinates => ajax.post('https://mocki.io/v1/558a4e02-7687-40cd-9144-59c60ac873a7', cordinates))
)

coordinatesWithSave
// .subscribe({
//     next: console.log,
//     complete: () => console.log("completed")
// });

// SWITCHMAP:

click.pipe(
    switchMap(() => interval1)
)
// .subscribe(console.log) 


// CONCATMAP:

click.pipe(
    concatMap(() => interval1.pipe(take(3)))
)
// .subscribe(console.log) 


const saveAnswer = (answer: string) => {
    return of(`Saved ${answer}`).pipe(
        delay(1500)
    );
}

const radioButtons = document.querySelectorAll('.radio-option');
const answerChange = fromEvent(radioButtons, 'click');

// only saves answer when the previous is finished
answerChange.pipe(
    concatMap((event: any) => saveAnswer(event.target.value))
)
// .subscribe(console.log)


// EXHAUSTMAP

// like concatMap but while already subscribed to an observable it throws away the others
click.pipe(
    exhaustMap(() => interval1.pipe(take(3)))
)
// .subscribe(console.log) 


const authenticateUser = () => {
    return ajax.post(
        'https://regres.in/api/login',
        {
            email: 'eve.holt@regres.in',
            password: 'cityslicka'
        }
    )
}

const loginButton = document.getElementById('login');

const login = fromEvent(loginButton, 'click');

login.pipe(
    tap(console.log),
    exhaustMap(() => authenticateUser())
)
// .subscribe(console.log)


// LAB 3:
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const pollingStatus = document.getElementById('polling-status');
const dog = document.getElementById('dog');

const startClick = fromEvent(startButton, 'click');
const stopClick = fromEvent(stopButton, 'click');

startClick.pipe(
    exhaustMap(() => timer(0, 5000).pipe(
        tap(() => {pollingStatus.innerHTML = 'Active'}),
        switchMapTo(
            ajax.getJSON('https://random.dog/woof.json').pipe(
                pluck('url')
            )
        ),
        takeUntil(stopClick),
        finalize(() => pollingStatus.innerHTML = 'Stopped')
    ))
)
// .subscribe((url: string) => (dog as HTMLImageElement).src = url)