import { useState } from 'react';
import useSWR from 'swr';
import { validateAddress, ValidationResult } from '@taquito/utils';
import { request, gql } from 'graphql-request';
import laggy from '../libs/swr-laggy-middleware';
import uniq from 'lodash/uniq';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
    use: [laggy],
  });

  return {
    isLoading: !data,
    users: data ? keyBy(data.tzprofiles, 'account') : null,
  };
}

function UserList({ addresses, onAddressRemove }) {
  const { users, isLoading } = useGetUsers(addresses);

  if (isLoading) {
    return 'is loading';
  }

  return (
    <List dense>
      {addresses.map((address) => (
        <ListItem
          key={address}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onAddressRemove(address)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={get(users, [address, 'alias'])} secondary={address} />
        </ListItem>
      ))}
    </List>
  );
}

function UserPicker({ addresses, onChange }) {
  const [addressesValue, setAddressesValue] = useState('');

  return (
    <div>
      <TextField
        id="outlined-multiline-static"
        label="Addresses"
        multiline
        rows={4}
        value={addressesValue}
        onChange={(ev) => {
          setAddressesValue(ev.target.value);
        }}
      />
      <Button
        onClick={() => {
          const words = addressesValue.match(/\b(\w+)\b/g);
          const validAddresses = words.filter((word) => validateAddress(word) === ValidationResult.VALID);
          setAddressesValue('');

          onChange(uniq([...validAddresses, ...addresses]));
        }}
        variant="text"
        disabled={!addressesValue}
      >
        Add
      </Button>
      <UserList
        addresses={addresses}
        onAddressRemove={(removedAddress) => {
          onChange(addresses.filter((address) => address !== removedAddress));
        }}
      />
    </div>
  );
}

export default UserPicker;
