
type ResponseData<T> = {
  status?: number;
  data?: T;
  message: string;
};

export const responseSuccess = <T>({status,data,message}:{status: number, data: T, message: string}): ResponseData<T> => {
  return {
    status,
    data,
    message
  };
};

export const responseError = <T>({data,message}:{ data: T, message: string}): ResponseData<T> => {
  return {
    data,
    message
  };
};