import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const TokenDescriptionTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 'none',
      font: 'Arial, sans-serif',
      backgroundColor: '#515C73',
      fontSize: '0.6rem',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: '#515C73',
    },
  })
);

export default TokenDescriptionTooltip;
