import {
  useSelector as useSelectorCustom,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { AppDispatch, RootState } from './store';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorCustom;
export const useAppDispatch = () => useDispatch<AppDispatch>();
