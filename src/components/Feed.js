import get from 'lodash/get';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TwitterIcon from '@mui/icons-material/Twitter';
import { ipfsToGatewayUri, formatTz, shortenTzAddress } from '../libs/utils';

function FeedItem({ event }) {
  return (
    <Paper
      elevation={1}
      sx={{
        overflow: 'hidden',
        mb: '1vw',
      }}
    >
      {/* divider={<Divider orientation="vertical" flexItem />} */}
      <Stack direction="row" spacing={0}>
        <Box
          sx={{
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '6vw',
            height: '6vw',
            minWidth: '6vw',
            minHeight: '6vw',
            maxWidth: '6vw',
            maxHeight: '6vw',
            lineHeight: 0,
          }}
        >
          {get(event, 'token.display_uri') && (
            <img
              src={ipfsToGatewayUri(get(event, 'token.display_uri'))}
              alt={get(event, 'token.name')}
              loading="lazy"
              style={{
                width: '6vw',
                height: '6vw',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: '2vw',
            ml: '2vw',
            width: '30vw',
          }}
        >
          <Typography variant="body2" component="p">
            <Chip
              label={event.category}
              color="primary"
              sx={{
                mr: 2,
              }}
            />
            2 minutes ago by{' '}
            {get(event, 'token.artist_address') ? (
              <Link href="">
                <Typography variant="body2" component="strong" color="primary">
                  {get(event, 'token.artist_profile.alias') || shortenTzAddress(get(event, 'token.artist_address'))}
                </Typography>
              </Link>
            ) : null}
            <IconButton
              color="primary"
              size="small"
              href=""
              sx={{
                ml: 0.5,
              }}
            >
              <TwitterIcon fontSize="inherit" />
            </IconButton>
            {/*
              {event.type}
              {event.implements === 'SALE' ? 'yes' : 'no'}
              {event.timestamp}
              {get(event, 'token.metadata_status')}
            */}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: '2vw',
            ml: '2vw',
            width: '29vw',
          }}
        >
          <Chip
            label={get(event, 'token.platform')}
            color="secondary"
            variant="outlined"
            sx={{
              mr: 2,
            }}
          />
          <Chip
            label={get(event, 'token.editions')}
            color="secondary"
            variant="outlined"
            sx={{
              mr: 2,
            }}
          />
          <Chip
            label="Primary"
            color="secondary"
            variant="outlined"
            sx={{
              mr: 2,
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mr: '2vw',
            ml: '2vw',
            width: '20vw',
          }}
        >
          <Box
            sx={{
              mr: 4,
            }}
          >
            {formatTz(event.price)}
          </Box>
          <Button variant="contained" size="small">
            Buy
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

function Feed({ events }) {
  return (
    <div className="Feed">
      <Box
        sx={{
          m: '4vw',
        }}
      >
        {(events || []).map((event) => (
          <FeedItem key={event.id} event={event} />
        ))}
      </Box>
    </div>
  );
}

export default Feed;
