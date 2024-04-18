const trackable = Symbol('trackable');

export function Trackable(isTrackable = true) {
  return function (target: any) {
    Reflect.defineMetadata(trackable, isTrackable, target);
    return target;
  };
}

Trackable.isTrackable = function (target: any) {
  return !!Reflect.getMetadata(trackable, target.constructor);
};
