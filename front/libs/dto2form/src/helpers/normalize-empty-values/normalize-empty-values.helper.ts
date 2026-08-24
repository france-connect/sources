import type { HttpClientDataInterface } from '@fc/http-client';
import { isEmptyValue } from '@fc/validators';

export const normalizeEmptyValues =
  (initialValues: Partial<HttpClientDataInterface> | undefined) =>
  (values: HttpClientDataInterface): HttpClientDataInterface => {
    const mergedValues = { ...initialValues, ...values };

    const normalizedEntries = Object.entries(mergedValues).map(([key, value]) => {
      const initialValue = initialValues?.[key];

      if (initialValue === undefined) {
        // @NOTE if the initialValue is undefined
        // There is an issue with the form
        // NULL will throw a 500
        return [key, null];
      }

      if (Array.isArray(value)) {
        const filtered = value.filter((v) => !isEmptyValue(v));
        const hasLength = filtered.length > 0;
        return [key, hasLength ? filtered : initialValue];
      }

      if (isEmptyValue(value)) {
        return [key, initialValue];
      }

      return [key, value];
    });

    return Object.fromEntries(normalizedEntries);
  };
