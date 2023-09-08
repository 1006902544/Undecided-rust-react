import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useGetActivityDetail } from '@/libs/api';
import type { ActivityDetail } from '@/libs/api/schema';

interface IUpdateContext {
  data?: ActivityDetail;
  isLoading?: boolean;
  refetchDetail?: () => void;
  isEdit: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  stepIncludes: number[];
  id?: number;
}

const UpdateContext = createContext<IUpdateContext>({
  isEdit: false,
  step: 1,
  setStep() {},
  stepIncludes: [],
});

export const useUpdateContext = () => {
  const context = useContext(UpdateContext);
  return useMemo(() => context, [context]);
};

export default function UpdateContextContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  //basic info
  const { search } = useLocation();

  const id = useMemo(() => {
    return qs.parse(search)?.id as string | undefined;
  }, [search]);

  const isEdit = useMemo(() => !!id, [id]);

  //query
  const {
    data,
    isLoading,
    refetch: refetchDetail,
  } = useGetActivityDetail(
    { id: id as unknown as number },
    {
      query: {
        enabled: isEdit,
      },
    }
  );

  //step
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isEdit) {
      setStep(data?.data.info ? 2 : 1);
    } else {
      setStep(0);
    }
  }, [isEdit, data]);

  const stepIncludes = useMemo(() => {
    if (isEdit) {
      if (data?.data.info) {
        return [0, 1, 2];
      } else {
        return [0, 1];
      }
    } else {
      return [0];
    }
  }, [data, isEdit]);

  return (
    <UpdateContext.Provider
      value={{
        data: data?.data,
        isLoading,
        isEdit,
        refetchDetail,
        setStep,
        step,
        stepIncludes,
        id: id ? Number(id) : undefined,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}
