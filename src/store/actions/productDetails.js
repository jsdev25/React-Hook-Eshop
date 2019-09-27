import * as Types from '../types';
import axios from 'axios';

import { getProductPromise } from '../../fakebackend/promiseData';
import { showToast } from './toast';

export const loadProductInit = () => ({
  type: Types.LOAD_PRODUCT_INIT,
});

export const loadProductError = error => dispatch => {
  dispatch({ type: Types.LOAD_PRODUCT_ERROR, payload: error });
  dispatch(showToast({ title: 'Error', text: error }));
};

export const loadProductSuccess = product => ({
  type: Types.LOAD_PRODUCT_SUCCESS,
  payload: product,
});

const errorHandler = (fn, dispatch) => {
  return async (arg1, arg2) => {
    try {
      await fn(arg1, arg2);
    } catch (error) {
      if (error.message) {
        dispatch(loadProductError(error.message));
      }
    }
  };
};

export const loadProduct = (id, callback) => async (dispatch, getState) => {
  dispatch(loadProductInit());

  errorHandler(async (id, callback) => {
    const response = await axios.get(`/product/${id}`);
    const product = response.data;

    //const product = await getProductPromise(id);
    // console.log(product);
    dispatch(loadProductSuccess(product));

    if (callback) callback();
  }, dispatch)(id, callback);
};
