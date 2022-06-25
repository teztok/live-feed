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
import Stack from '@mui/material/Stack';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ReactTimeAgo from 'react-time-ago';
import {
  formatTz,
  getPreviewImage,
  getArtistInfo,
  getPlatform,
  isTokenUpToDate,
  getSwapPrice,
  isBestPrice,
  getTokenLink,
  getUserInfo,
} from '../libs/utils';
import { EVENT_CATEGORY_MINT, EVENT_CATEGORY_SWAP, EVENT_CATEGORY_SALE, EVENT_CATEGORY_OFFER, EVENTS_WITH_BUY_SUPPORT } from '../constants';
import BuyButton from './BuyButton';
import useImage from '../hooks/use-image';

const EVENT_CATEGORY_TO_CHIP_PROPS = {
  [EVENT_CATEGORY_MINT]: { color: 'primary', variant: 'outlined' },
  [EVENT_CATEGORY_SWAP]: { color: 'primary' },
  [EVENT_CATEGORY_OFFER]: { color: 'error', variant: 'outlined' },
  [EVENT_CATEGORY_SALE]: { color: 'info', variant: 'outlined' },
};

function UserLink({ address, name, twitter }) {
  return (
    <>
      {address ? (
        <Typography variant="body2" component="strong" color="primary">
          <Link href={`https://objkt.com/profile/${address}`} target="_blank" rel="noopener noreferrer" color="inherit">
            {name}
          </Link>
        </Typography>
      ) : null}

      {twitter ? (
        <IconButton
          color="primary"
          size="small"
          href={`https://twitter.com/${twitter}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            ml: 0.15,
          }}
        >
          <TwitterIcon fontSize="inherit" />
        </IconButton>
      ) : null}
    </>
  );
}

function PreviewImage({ src, alt, imageSize }) {
  const { status } = useImage(src);
  const size = imageSize === 'large' ? '140px' : '90px';
  const objectFit = imageSize === 'large' ? 'contain' : 'cover';
  let content;

  if (!src || status === 'loading') {
    content = (
      <CircularProgress
        color="primary"
        size={14}
        thickness={5}
        sx={{
          mr: 2,
          ml: 2,
        }}
      />
    );
  } else if (status === 'failed') {
    content = 'N/A';
  } else {
    content = (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: size,
          height: size,
          objectFit: objectFit,
        }}
      />
    );
  }

  return (
    <TableCell
      sx={{
        p: 0,
        width: size,
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
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          backgroundColor: '#232a3b',
          lineHeight: 0,
        }}
      >
        {content}
      </Box>
    </TableCell>
  );
}

function Meta({ event }) {
  const artistInfo = getArtistInfo(event);
  const platform = getPlatform(event);
  const editions = get(event, 'token.fx_collection_editions') || get(event, 'token.editions');

  return (
    <TableCell>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            pr: 3,
            pl: 3,
          }}
        >
          <Stack spacing={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {event.category === EVENT_CATEGORY_MINT ? (
                <>
                  By&nbsp;
                  <UserLink {...artistInfo} color="primary" />
                </>
              ) : null}

              {event.category === EVENT_CATEGORY_SWAP ? (
                <>
                  {!event.isSecondarySwap && (
                    <>
                      By&nbsp;
                      <UserLink {...artistInfo} color="primary" />
                    </>
                  )}
                </>
              ) : null}

              {event.category === EVENT_CATEGORY_OFFER ? (
                <>
                  Made by&nbsp;
                  <UserLink {...getUserInfo(event, 'buyer')} />
                </>
              ) : null}

              {event.category === EVENT_CATEGORY_SALE ? (
                <>
                  From&nbsp;
                  <UserLink {...getUserInfo(event, 'seller')} />
                  &nbsp;
                  <ArrowRightAltIcon />
                  &nbsp;
                  <UserLink {...getUserInfo(event, 'buyer')} />
                </>
              ) : null}

              <Typography variant="body2" sx={{ ml: 1 }}>
                <ReactTimeAgo date={new Date(event.timestamp)} />
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Tooltip title={event.type} arrow placement="top">
                <Chip
                  size="small"
                  label={event.category}
                  {...EVENT_CATEGORY_TO_CHIP_PROPS[event.category]}
                  sx={{
                    mr: 1,
                  }}
                />
              </Tooltip>

              {platform ? (
                <Chip
                  size="small"
                  label={platform}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    mr: 1,
                  }}
                />
              ) : null}

              {editions ? (
                <Chip
                  size="small"
                  label={`${editions} Edition${editions > 1 ? 's' : ''}`}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    mr: 1,
                  }}
                />
              ) : null}

              {event.category === EVENT_CATEGORY_SWAP && (
                <>
                  {event.isSecondarySwap ? (
                    <Chip label="Secondary" color="warning" variant="contained" size="small" />
                  ) : (
                    <Chip label="Primary" color="primary" variant="contained" size="small" />
                  )}
                </>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
    </TableCell>
  );
}

function Creator({ event }) {
  const artistInfo = getArtistInfo(event);

  return (
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
          <Stack>
            <Box>Artist</Box>
            <Box>
              <UserLink {...artistInfo} color="primary" />
            </Box>
          </Stack>
        </Box>
      </Box>
    </TableCell>
  );
}

function Action({ event }) {
  const tokenLink = getTokenLink(event);
  const showBuyButton = EVENTS_WITH_BUY_SUPPORT.includes(event.type);

  return (
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
        {!isTokenUpToDate(event) && (
          <CircularProgress
            color="primary"
            size={14}
            thickness={5}
            sx={{
              mr: 2,
              ml: 2,
            }}
          />
        )}

        {event.category === EVENT_CATEGORY_SWAP && (
          <>
            <Box
              sx={{
                mr: showBuyButton ? 4 : 1,
              }}
            >
              {isBestPrice(event) ? (
                <Tooltip title="Best Price" arrow placement="top">
                  <PaidIcon
                    color="primary"
                    sx={{
                      mr: 1,
                      transform: 'translate3d(0,6px,0)',
                    }}
                  />
                </Tooltip>
              ) : null}
              {event.amount || 1} &nbsp;&times;&nbsp;&nbsp;
              <Typography variant="body2" component="strong" color="primary">
                {formatTz(getSwapPrice(event))}
              </Typography>
            </Box>
            {showBuyButton && <BuyButton event={event} />}
          </>
        )}

        {(event.category === EVENT_CATEGORY_OFFER || event.category === EVENT_CATEGORY_SALE) && (
          <>
            <Box
              sx={{
                mr: 1,
              }}
            >
              <Typography variant="body2" component="strong" color="primary">
                {formatTz(event.price)}
              </Typography>
            </Box>
          </>
        )}

        {tokenLink ? (
          <Button href={tokenLink} target="_blank" rel="noopener noreferrer" variant="contained" size="small" sx={{ ml: 2 }}>
            View
          </Button>
        ) : null}
      </Box>
    </TableCell>
  );
}

function EventItem({ event, imageSize }) {
  const rowStyles = {};

  if (event.isNew) {
    rowStyles.backgroundColor = '#2e3546';
  }

  return (
    <TableRow style={rowStyles}>
      <PreviewImage src={getPreviewImage(event)} alt={get(event, 'token.name')} imageSize={imageSize} />
      <Meta event={event} />
      <Creator event={event} />
      <Action event={event} />
    </TableRow>
  );
}

function Feed({ events, imageSize }) {
  let content;

  if (!events || !events.length) {
    content = <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '90vh' }}>It's pretty silent right now...</Box>;
  } else {
    content = (
      <TableContainer
        sx={{
          p: 4,
          mt: '-10px',
        }}
      >
        <Table>
          <TableBody>
            {(events || []).map((event) => (
              <EventItem key={event.id} event={event} imageSize={imageSize} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div className="Feed">
      <Toolbar />
      {content}
    </div>
  );
}

export default Feed;
