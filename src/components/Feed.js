import get from 'lodash/get';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import TwitterIcon from '@mui/icons-material/Twitter';
import PaidIcon from '@mui/icons-material/Paid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Toolbar from '@mui/material/Toolbar';
import { ipfsToGatewayUri, formatTz, shortenTzAddress } from '../libs/utils';

function FeedItem({ event }) {
  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            p: 0,
            width: '70px',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70px',
              height: '70px',
              minWidth: '70px',
              minHeight: '70px',
              maxWidth: '70px',
              maxHeight: '70px',
              backgroundColor: '#232a3b',
              lineHeight: 0,
            }}
          >
            {!(event.category === 'MINT') &&
              <>
                {get(event, 'token.display_uri') && (
                  <img
                    src={ipfsToGatewayUri(get(event, 'token.display_uri'))}
                    alt={get(event, 'token.name')}
                    loading="lazy"
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </>
            }
          </Box>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box
              sx={{
                pr: 3,
                pl: 3,
              }}
            >
              {!(event.category === 'MINT') ?
                <Chip
                  label={event.category}
                  color="primary"
                  sx={{
                    mr: 2,
                  }}
                />
              :
                <Chip
                  label={event.category}
                  color="primary"
                  variant="outlined"
                  sx={{
                    mr: 2,
                  }}
                />
              }
              2 minutes ago by{' '}
              {get(event, 'token.artist_address') ? (
                <Typography variant="body2" component="strong" color="primary">
                  <Link href="https://objkt.com">
                    {get(event, 'token.artist_profile.alias') || shortenTzAddress(get(event, 'token.artist_address'))}
                  </Link>
                </Typography>
              ) : null}
              <IconButton
                color="primary"
                size="small"
                href="https://twitter.com"
                sx={{
                  ml: 0.5,
                }}
              >
                <TwitterIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Box
              sx={{
                pr: 3,
                pl: 3,
              }}
            >
              {!(event.category === 'MINT') &&
                <>
                  <Chip
                    label={get(event, 'token.platform')}
                    color="secondary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                    }}
                  />
                  <Chip
                    label={`${get(event, 'token.editions')}  Editions`}
                    color="secondary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                    }}
                  />
                  <Chip
                    label="Whitelist"
                    color="secondary"
                    variant="outlined"
                    sx={{
                      mr: 2,
                    }}
                  />
                  <Chip 
                    label="Primary" 
                    color="primary" 
                    variant="contained" 
                  />
                </>
              }
            </Box>
          </Box>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 3,
              pl: 3,
            }}
          >
            {!(event.category === 'MINT') ?
              <>
                <Box
                  sx={{
                    mr: 4,
                  }}
                >
                  <Tooltip title="Best Price" arrow placement="top">
                    <PaidIcon
                      color="primary"
                      sx={{
                        mr: 1,
                        transform: 'translate3d(0,6px,0)',
                      }}
                    />
                  </Tooltip>
                  20 &nbsp;&times;&nbsp;&nbsp;
                  <Typography variant="body2" component="strong" color="primary">
                    {formatTz(event.price)}
                  </Typography>
                </Box>
                <Button variant="contained" size="small">
                  Buy
                </Button>
              </>
            :
              <>
                Fetching metadata 
                <CircularProgress 
                  color="primary" 
                  size={14}
                  thickness={5}
                  sx={{
                    ml: 2,
                  }}
                />
              </>
            }
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}

function Feed({ events }) {
  return (
    <div className="Feed">
      <Toolbar></Toolbar>
      <TableContainer
        sx={{
          p: 4,
          mt: '-10px',
        }}
      >
        <Table>
          <TableBody>
            {(events || []).map((event) => (
              <FeedItem key={event.id} event={event} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Feed;
