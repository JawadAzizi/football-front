import { BaseApi } from '@/apis/BaseApi';
import { ApiError, PaginatedResponse, QueryParams } from '@/utils/Axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

// Base query configuration
export interface BaseQueryConfig {
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: number | boolean;
}

// Query key factory for consistent key generation
export class QueryKeyFactory {
  constructor(private resource: string) {}

  all = () => [this.resource] as const;
  lists = () => [...this.all(), 'list'] as const;
  list = (params?: QueryParams) => [...this.lists(), params] as const;
  details = () => [...this.all(), 'detail'] as const;
  detail = (id: string | number) => [...this.details(), id] as const;
  infinite = (params?: QueryParams) => [...this.all(), 'infinite', params] as const;
  custom = (key: string, params?: any) => [...this.all(), key, params] as const;
}

// Base React Query service class
export abstract class useBase<T = any, CreateT = Partial<T>, UpdateT = Partial<T>> {
  protected api: BaseApi<T, CreateT, UpdateT>;
  protected queryKeys: QueryKeyFactory;
  protected defaultConfig: BaseQueryConfig;

  constructor(
    api: BaseApi<T, CreateT, UpdateT>,
    resource: string,
    defaultConfig?: BaseQueryConfig
  ) {
    this.api = api;
    this.queryKeys = new QueryKeyFactory(resource);
    this.defaultConfig = {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
      ...defaultConfig,
    };
  }

  // GET single item query
  useGet(
    id: string | number,
    config?: AxiosRequestConfig,
    options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: this.queryKeys.detail(id),
      queryFn: () => this.api.get(id, config),
      enabled: !!id,
      ...this.defaultConfig,
      ...options,
    });
  }

  // GET list query
  useList(
    params?: QueryParams,
    config?: AxiosRequestConfig,
    options?: Omit<UseQueryOptions<PaginatedResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: this.queryKeys.list(params),
      queryFn: () => this.api.list(params, config),
      ...this.defaultConfig,
      ...options,
    });
  }

  // GET all items query (non-paginated)
  useGetAll(
    config?: AxiosRequestConfig,
    options?: Omit<UseQueryOptions<T[], ApiError>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey: this.queryKeys.custom('all'),
      queryFn: () => this.api.getAll(config),
      ...this.defaultConfig,
      ...options,
    });
  }

  // Infinite query for pagination
  useInfiniteList(
    baseParams?: Omit<QueryParams, 'page'>,
    config?: AxiosRequestConfig,
    options?: Omit<
      UseInfiniteQueryOptions<PaginatedResponse<T>, ApiError>,
      'queryKey' | 'queryFn' | 'getNextPageParam'
    >
  ) {
    return useInfiniteQuery({
      queryKey: this.queryKeys.infinite(baseParams),
      queryFn: ({ pageParam = 1 }) =>
        this.api.list({ ...baseParams, page: pageParam }, config),
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      ...this.defaultConfig,
      ...options,
    });
  }

  // CREATE mutation
  useCreate(
    options?: UseMutationOptions<T, ApiError, { data: CreateT; config?: AxiosRequestConfig }>
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data, config }) => this.api.create(data, config),
      
      onSuccess: (newItem) => {
        // Invalidate and refetch list queries
        queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
        
        // Optimistically add to cache if we have an ID
        if ('id' in newItem) {
          queryClient.setQueryData(
            this.queryKeys.detail((newItem as any).id),
            newItem
          );
        }
      },
      ...options,
    });
  }

  // UPDATE mutation
  useUpdate(options?: UseMutationOptions<T, ApiError,{ id: string | number; data: UpdateT; config?: AxiosRequestConfig }>) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data, config }) => this.api.update(id, data, config),
      onSuccess: (updatedItem, { id }) => {
        // Update item in cache
        queryClient.setQueryData(this.queryKeys.detail(id), updatedItem);
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
      },
      ...options,
    });
  }

  // PATCH mutation
  usePatch(
    options?: UseMutationOptions<
      T,
      ApiError,
      { id: string | number; data: Partial<UpdateT>; config?: AxiosRequestConfig }
    >
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data, config }) => this.api.patch(id, data, config),
      onSuccess: (updatedItem, { id }) => {
        queryClient.setQueryData(this.queryKeys.detail(id), updatedItem);
        queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
      },
      ...options,
    });
  }

  // DELETE mutation
  useDelete(
    options?: UseMutationOptions<void, ApiError, { id: string | number; config?: AxiosRequestConfig }>
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, config }) => this.api.delete(id, config),
      onSuccess: (_, { id }) => {
        // Remove item from cache
        queryClient.removeQueries({ queryKey: this.queryKeys.detail(id) });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
      },
      ...options,
    });
  }

  // BULK CREATE mutation
  useBulkCreate(
    options?: UseMutationOptions<T[], ApiError, { items: CreateT[]; config?: AxiosRequestConfig }>
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ items, config }) => this.api.bulkCreate(items, config),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: this.queryKeys.all() });
      },
      ...options,
    });
  }

  // BULK DELETE mutation
  useBulkDelete(
    options?: UseMutationOptions<
      void,
      ApiError,
      { ids: (string | number)[]; config?: AxiosRequestConfig }
    >
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ ids, config }) => this.api.bulkDelete(ids, config),
      onSuccess: (_, { ids }) => {
        // Remove items from cache
        ids.forEach((id) => {
          queryClient.removeQueries({ queryKey: this.queryKeys.detail(id) });
        });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
      },
      ...options,
    });
  }

  // Utility methods for manual cache management
  invalidateAll() {
    const queryClient = useQueryClient();
    return queryClient.invalidateQueries({ queryKey: this.queryKeys.all() });
  }

  invalidateLists() {
    const queryClient = useQueryClient();
    return queryClient.invalidateQueries({ queryKey: this.queryKeys.lists() });
  }

  invalidateDetail(id: string | number) {
    const queryClient = useQueryClient();
    return queryClient.invalidateQueries({ queryKey: this.queryKeys.detail(id) });
  }

  prefetchDetail(id: string | number, config?: AxiosRequestConfig) {
    const queryClient = useQueryClient();
    return queryClient.prefetchQuery({
      queryKey: this.queryKeys.detail(id),
      queryFn: () => this.api.get(id, config),
      ...this.defaultConfig,
    });
  }

  prefetchList(params?: QueryParams, config?: AxiosRequestConfig) {
    const queryClient = useQueryClient();
    return queryClient.prefetchQuery({
      queryKey: this.queryKeys.list(params),
      queryFn: () => this.api.list(params, config),
      ...this.defaultConfig,
    });
  }

  // Optimistic update helper
  setOptimisticData(id: string | number, data: Partial<T>) {
    const queryClient = useQueryClient();
    queryClient.setQueryData(this.queryKeys.detail(id), (oldData: T | undefined) => {
      if (!oldData) return undefined;
      return { ...oldData, ...data };
    });
  }
}

// Extended User Query Service example
// import { User, CreateUser, UpdateUser, UserApi } from './base-api';

// export class UserQueryService extends useBase<User, CreateUser, UpdateUser> {
//   constructor(userApi: UserApi) {
//     super(userApi, 'users', {
//       staleTime: 10 * 60 * 1000, // 10 minutes for users
//       cacheTime: 15 * 60 * 1000, // 15 minutes
//     });
//   }

//   // Custom query: Get user profile
//   useProfile(
//     options?: Omit<UseQueryOptions<User, ApiError>, 'queryKey' | 'queryFn'>
//   ) {
//     return useQuery({
//       queryKey: this.queryKeys.custom('profile'),
//       queryFn: () => (this.api as UserApi).getProfile(),
//       ...this.defaultConfig,
//       ...options,
//     });
//   }

//   // Custom mutation: Change password
//   useChangePassword(
//     options?: UseMutationOptions<
//       void,
//       ApiError,
//       { oldPassword: string; newPassword: string }
//     >
//   ) {
//     const queryClient = useQueryClient();

//     return useMutation({
//       mutationFn: ({ oldPassword, newPassword }) =>
//         (this.api as UserApi).changePassword(oldPassword, newPassword),
//       onSuccess: () => {
//         // Invalidate profile after password change
//         queryClient.invalidateQueries({ queryKey: this.queryKeys.custom('profile') });
//       },
//       ...options,
//     });
//   }

//   // Custom query: Search users by email
//   useSearchByEmail(
//     email: string,
//     options?: Omit<UseQueryOptions<User[], ApiError>, 'queryKey' | 'queryFn'>
//   ) {
//     return useQuery({
//       queryKey: this.queryKeys.custom('searchByEmail', email),
//       queryFn: () => (this.api as UserApi).searchByEmail(email),
//       enabled: !!email && email.length > 2,
//       ...this.defaultConfig,
//       ...options,
//     });
//   }

//   // Custom query: Get users by role
//   useGetByRole(
//     role: string,
//     params?: QueryParams,
//     options?: Omit<UseQueryOptions<PaginatedResponse<User>, ApiError>, 'queryKey' | 'queryFn'>
//   ) {
//     return useQuery({
//       queryKey: this.queryKeys.custom('byRole', { role, ...params }),
//       queryFn: () => (this.api as UserApi).getByRole(role, params),
//       enabled: !!role,
//       ...this.defaultConfig,
//       ...options,
//     });
//   }

//   // Custom infinite query for users by role
//   useInfiniteUsersByRole(
//     role: string,
//     baseParams?: Omit<QueryParams, 'page'>,
//     options?: Omit<
//       UseInfiniteQueryOptions<PaginatedResponse<User>, ApiError>,
//       'queryKey' | 'queryFn' | 'getNextPageParam'
//     >
//   ) {
//     return useInfiniteQuery({
//       queryKey: this.queryKeys.custom('infiniteByRole', { role, ...baseParams }),
//       queryFn: ({ pageParam = 1 }) =>
//         (this.api as UserApi).getByRole(role, { ...baseParams, page: pageParam }),
//       getNextPageParam: (lastPage) => {
//         if (lastPage.page < lastPage.totalPages) {
//           return lastPage.page + 1;
//         }
//         return undefined;
//       },
//       enabled: !!role,
//       ...this.defaultConfig,
//       ...options,
//     });
//   }
// }



// export const initializeQueryServices = () => {
//   const api = initializeApi();
  
//   return {
//     users: new UserQueryService(api.users),
//     // Add other query services here
//     // posts: new PostQueryService(api.posts),
//     // comments: new CommentQueryService(api.comments),
//   };
// };

// // Hook for accessing all services
// export const useServices = () => {
//   return initializeQueryServices();
// };

// Example usage in components:
/*
import { useServices } from './react-query-service';

function UserList() {
  const { users } = useServices();
  
  // Standard queries
  const { data: userList, isLoading, error } = users.useList({ page: 1, limit: 10 });
  const { data: user } = users.useGet(123);
  
  // Custom queries
  const { data: profile } = users.useProfile();
  const { data: adminUsers } = users.useGetByRole('admin');
  
  // Mutations
  const createUser = users.useCreate({
    onSuccess: () => {
      console.log('User created successfully!');
    },
  });
  
  const updateUser = users.useUpdate({
    onSuccess: () => {
      console.log('User updated successfully!');
    },
  });
  
  const deleteUser = users.useDelete({
    onSuccess: () => {
      console.log('User deleted successfully!');
    },
  });
  
  // Infinite query
  const {
    data: infiniteUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = users.useInfiniteList({ limit: 20 });

  return (
    <div>
      {userList?.data.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => updateUser.mutate({ id: user.id, data: { name: 'New Name' } })}>
            Update
          </button>
          <button onClick={() => deleteUser.mutate({ id: user.id })}>
            Delete
          </button>
        </div>
      ))}
      
      <button onClick={() => createUser.mutate({ data: { name: 'John', email: 'john@example.com', password: 'secret' } })}>
        Create User
      </button>
    </div>
  );
}
*/