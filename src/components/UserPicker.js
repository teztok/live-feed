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
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import FormHelperText from '@mui/material/FormHelperText';
import { shortenTzAddress } from '../libs/utils';
import { TEZTOK_GRAPHQL_API } from '../constants';

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
  const { data } = useSWR(['/get-users', addresses.join(',')], () => request(TEZTOK_GRAPHQL_API, GetUsersQuery, { addresses }), {
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
    return (
      <Box
        sx={{
          mt: 4,
        }}
      ></Box>
    );
  }

  return (
    <List
      dense
      sx={{
        mt: 4,
      }}
    >
      {addresses.map((address) => (
        <ListItem
          key={address}
          secondaryAction={
            <IconButton edge="end" aria-label="delete" size="small" color="primary" onClick={() => onAddressRemove(address)}>
              <RemoveCircleOutlineIcon fontSize="inherit" />
            </IconButton>
          }
          dense
        >
          <Tooltip title={address} enterDelay={500} arrow placement="left">
            <ListItemText
              primary={get(users, [address, 'alias']) ? get(users, [address, 'alias']) : '–'}
              secondary={shortenTzAddress(address)}
            />
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
}

function UserPicker({ addresses, onChange }) {
  const [addressesValue, setAddressesValue] = useState('');

  return (
    <Box>
      <TextField
        id="outlined-multiline-static"
        label="Tezos Addresses"
        multiline
        autoFocus
        rows={4}
        value={addressesValue}
        onChange={(ev) => {
          setAddressesValue(ev.target.value);
        }}
        sx={{
          width: '100%',
        }}
      />
      <FormHelperText
        sx={{
          mt: 2,
          mr: 2,
          ml: 2,
        }}
      >
        Insert one or more Tezos addresses in the text field above, separated by commas or by line breaks.
      </FormHelperText>
      <Button
        onClick={() => {
          const words = addressesValue.match(/\b(\w+)\b/g);
          const validAddresses = words.filter((word) => validateAddress(word) === ValidationResult.VALID);
          setAddressesValue('');

          onChange(uniq([...validAddresses, ...addresses]));
        }}
        variant="contained"
        disabled={!addressesValue}
        sx={{
          mt: 2,
          width: '100%',
        }}
      >
        Add to watchlist
      </Button>
      <UserList
        addresses={addresses}
        onAddressRemove={(removedAddress) => {
          onChange(addresses.filter((address) => address !== removedAddress));
        }}
      />
    </Box>
  );
}

export default UserPicker;
