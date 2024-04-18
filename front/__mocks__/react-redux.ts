export const useSelector = jest.fn();

export const useDispatch = jest.fn(() => jest.fn());

export const Provider = jest.fn(({ children }) => children);
