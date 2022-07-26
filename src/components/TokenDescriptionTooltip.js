import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const TokenDescriptionTooltip = styled(({ className, ...props }) => (
  <Tooltip disableInteractive {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    maxWidth: '300px',
    backgroundColor: '#515C73',
    fontFamily: 'Courier',
    fontSize: '0.2rem',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#515C73',
  },
}));

export default TokenDescriptionTooltip;
