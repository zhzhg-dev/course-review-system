import request from './request';

export const updateProfile = (data) => {
  return request.post('/setting/updateProfile', data);
};

export const updatePassword = (data) => {
  return request.post('/setting/updatePassword', data);
};

export const deleteUser = (data) => {
  const {id} = data
  return request.delete(`/setting/deleteUser/${id}`);
};

export const updateAvatar = (data) => {
  return request.post(`/setting/updateAvatar`,data);
};
