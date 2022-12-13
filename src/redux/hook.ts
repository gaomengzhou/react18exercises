import {
  useSelector as useSelectorCustom,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { AppDispatch, RootState } from './store';

// eslint-disable-next-line import/prefer-default-export
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorCustom;
export const useAppDispatch = () => useDispatch<AppDispatch>();
