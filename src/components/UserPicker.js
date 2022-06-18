import useSWR from 'swr';
import { request, gql } from 'graphql-request';
import { TEZTOK_API } from '../constants';

const GetUsersQuery = gql`
  query GetUsers($addresses: [String]) {
    tzprofiles(where: { account: { _in: $addresses } }) {
      account
      alias
      twitter
    }
  }
`;

function useGetUsers(addresses) {
  const { data } = useSWR(['/get-users', addresses.join(',')], () => request(TEZTOK_API, GetUsersQuery, { addresses }), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return {
    isLoading: !data,
    users: data ? data.tzprofiles : null,
  };
}

function UserPicker({ addresses = ['tz1P9djZkQKQdvt68eixoyBf8ezNYjgrEdue'] }) {
  const { users, isLoading } = useGetUsers(addresses);

  console.log('users', users);

  if (isLoading) {
    return 'is loading';
  }

  return <div>### USERS ###</div>;
}

export default UserPicker;
