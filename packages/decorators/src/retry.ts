import { of, throwError, retry, defer, firstValueFrom } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

export function AutoRetry(retryConfig: {
  /**
   * Max attempt times
   */
  maxAttempts: number;
  /**
   * Delay on retry in milliseconds
   */
  delay: number;
  /**
   * Retry on condition
   * @param error
   * @param count
   * @returns
   */
  retryWhen?: <T extends Error>(error: T, count: number) => boolean;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return firstValueFrom(
        defer(() => originalMethod.apply(this, args)).pipe(
          retry({
            count: retryConfig.maxAttempts,
            delay: (err, count) => {
              return of(err).pipe(
                concatMap((error) => {
                  if (
                    retryConfig.retryWhen &&
                    !retryConfig.retryWhen(error, count)
                  ) {
                    return throwError(() => error);
                  }
                  return of(error);
                }),
                delay(retryConfig.delay)
              );
            },
          })
        )
      );
    };
    return descriptor;
  };
}
