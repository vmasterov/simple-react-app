import { FetchOptions, FetchResponse, ofetch } from 'ofetch';
import { enqueueSnackbar, OptionsObject } from 'notistack';

function getErrorTextByHttpStatus(httpStatus: number) {
  switch (httpStatus) {
    case 401:
      return 'Вы не авторизованы';
    case 403:
      return 'У вас не достаточно прав для выполнения операции';
    case 404:
      return 'Не найдено';
    case 503:
      return 'Сервис временно не доступен';
    default:
      return 'Что-то пошло не так :(';
  }
}

function showError(response: FetchResponse<{ errors?: string[] }>) {
  type MessageTypes = 'error' | 'default' | 'success' | 'warning' | 'info';
  const errors = response?._data ? Object.values(response._data).map((error) => error.join(', ')) : [];
  const options = { variant: 'error', autoHideDuration: 3000 } as OptionsObject<MessageTypes>;

  if (errors.length) {
    enqueueSnackbar(
      <div>
        {errors.map((message) => (
          <div key={Math.random()}>{message}</div>
        ))}
      </div>,
      options
    );
  } else {
    enqueueSnackbar(`${response.status}: ${getErrorTextByHttpStatus(response.status)}`, options);
  }
}

const defaultOptions: FetchOptions = {
  baseURL: 'https://uselessfacts.jsph.pl/api/v2/facts',
  onResponseError: async ({ response }) => {
    showError(response);
  },
};

function createHttpClient(options?: FetchOptions) {
  const fetch = ofetch.create({ ...defaultOptions, ...options });

  async function get<T>(url: string, fetchOptions: FetchOptions<'json'> = {}) {
    return fetch<T>(url, {
      ...fetchOptions,
      method: 'GET',
    });
  }

  async function post<T>(url: string, fetchOptions: FetchOptions<'json'> = {}) {
    return fetch<T>(url, {
      ...fetchOptions,
      method: 'POST',
    });
  }

  return { get, post };
}

export default createHttpClient();
