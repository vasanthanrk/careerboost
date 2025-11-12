import api from '../api/axiosClient';

export const handleFeatureCheck = async (featureName) => {
  try {
    const res = await api.get(`/check-feature/${featureName}`);
    if (!res.data.allowed) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    return false;
  }
};