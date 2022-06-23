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
} from '../libs/utils';
import { EVENT_CATEGORY_MINT, EVENT_CATEGORY_SWAP, EVENT_CATEGORY_SALE, EVENT_CATEGORY_OFFER, EVENTS_WITH_BUY_SUPPORT } from '../constants';
import BuyButton from './BuyButton';

const EVENT_CATEGORY_TO_CHIP_PROPS = {
  [EVENT_CATEGORY_MINT]: { color: 'primary', variant: 'outlined' },
  [EVENT_CATEGORY_SWAP]: { color: 'primary' },
  [EVENT_CATEGORY_OFFER]: { color: 'error', variant: 'outlined' },
  [EVENT_CATEGORY_SALE]: { color: 'info', variant: 'outlined' },
};

function PreviewImage({ src, alt, imageSize }) {
  const size = imageSize === 'large' ? '140px' : '70px';
  const objectFit = imageSize === 'large' ? 'contain' : 'cover';

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
        {src ? (
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
        ) : null}
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
          <Tooltip title={event.type} arrow placement="top">
            <Chip
              label={event.category}
              {...EVENT_CATEGORY_TO_CHIP_PROPS[event.category]}
              sx={{
                mr: 2,
              }}
            />
          </Tooltip>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">
              <ReactTimeAgo date={new Date(event.timestamp)} /> &nbsp;&nbsp;
            </Typography>

            {artistInfo.address ? (
              <Link href={`https://objkt.com/profile/${artistInfo.address}`}>
                <Typography variant="body2" component="strong" color="primary">
                  {artistInfo.name}
                </Typography>
              </Link>
            ) : null}

            {artistInfo.twitter ? (
              <IconButton
                color="primary"
                size="small"
                href={`https://twitter.com/${artistInfo.twitter}`}
                sx={{
                  ml: 0.15,
                }}
              >
                <TwitterIcon fontSize="inherit" />
              </IconButton>
            ) : null}
          </Box>
        </Box>
        <Box
          sx={{
            pr: 3,
            pl: 3,
          }}
        >
          {platform ? (
            <Chip
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
              label={`${editions} Edition${editions > 1 ? 's' : ''}`}
              color="secondary"
              variant="outlined"
              sx={{
                mr: 1,
              }}
            />
          ) : null}

          {event.category === 'SWAP' && (
            <>
              {event.isSecondarySwap ? (
                <Chip label="Secondary" color="warning" variant="contained" />
              ) : (
                <Chip label="Primary" color="primary" variant="contained" />
              )}
            </>
          )}
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

        {event.category === 'SWAP' && (
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

        {(event.category === 'OFFER' || event.category === 'SALE') && (
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
    rowStyles.backgroundColor = '#052C1F';
  }

  return (
    <TableRow style={rowStyles}>
      <PreviewImage src={getPreviewImage(event)} alt={get(event, 'token.name')} imageSize={imageSize} />
      <Meta event={event} />
      <Action event={event} />
    </TableRow>
  );
}

function Feed({ events, imageSize }) {
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
              <EventItem key={event.id} event={event} imageSize={imageSize} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Feed;
