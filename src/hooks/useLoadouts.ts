import { useQuery, useMutations } from 'deepspace';

export function useLoadouts() {
  const { data: loadouts, loading } = useQuery('loadouts', {
    filter: { isPublic: true }
  });

  const { mutate: create } = useMutations('loadouts');

  const createLoadout = async (payload: any) => {
    await create(payload);
  };

  return { loadouts, loading, createLoadout };
}
