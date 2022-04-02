import { Observable, fromEvent, of, from, interval } from 'rxjs';

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