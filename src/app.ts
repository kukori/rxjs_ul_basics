import { Observable } from 'rxjs';

const observer = {
    next: (value: any) => console.log('next', value),
    error: (error: Error) => console.log('error', error),
    complete: () => console.log('complete!'),

}

const observable = new Observable(subscriber => {
    // pushing Hello to the subscriber
    subscriber.next('Hello');
    subscriber.next('world');
    subscriber.complete();
}) 

observable.subscribe(
    //observer here
    observer
)
