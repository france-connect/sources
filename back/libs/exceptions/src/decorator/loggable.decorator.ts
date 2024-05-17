const loggable = Symbol('loggable');

export function Loggable(isLoggable = true) {
  return function (target: any) {
    Reflect.defineMetadata(loggable, isLoggable, target);
    return target;
  };
}

Loggable.isLoggable = function (target: any) {
  return !!Reflect.getMetadata(loggable, target.constructor);
};
