import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
  Stack,
} from '@mui/material';

import { sentenceCase } from 'change-case';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% / 4)',
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BillCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BillCard({ post, index }) {
  // const { cover, title, view, comment, share, author, createdAt } = post;
  // const { name, paymentMode, transactionId, amount, quantity, category } = post;
  const {
    amount,
    category,
    name,
    paymentDate,
    paymentMode,
    quantity,
    stockReference,
    transactionId,
  } = post;

  // const POST_INFO = [
  //   { number: comment, icon: 'eva:message-circle-fill' },
  //   { number: view, icon: 'eva:eye-fill' },
  //   { number: share, icon: 'eva:share-fill' },
  // ];

  return (
    <Grid
      item
      xs={12}
      // sm={latestPostLarge ? 12 : 6}
      sm={12}
      // md={latestPostLarge ? 6 : 3}
      md={6}
    >
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle>
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
            }}
          />
          <AvatarStyle
            alt={name}
            src={`/static/mock-images/avatars/avatar_1.jpg`}
          />

          <CoverImgStyle
            alt={name}
            src={`/static/mock-images/covers/cover_${(index + 1) % 25}.jpg`}
          />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {fDate(paymentDate)}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            spacing={2}
          >
            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle2"
              underline="hover"
              component={RouterLink}
            >
              {name}
            </TitleStyle>

            <TitleStyle
              variant="subtitle2"
              sx={{
                color: 'text.disabled',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <Label variant="ghost" color={'primary'}>
                {sentenceCase(category.name)}
              </Label>
            </TitleStyle>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TitleStyle
              // gutterBottom
              variant="caption"
              sx={{
                color: 'text.disabled',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {paymentMode}
            </TitleStyle>
            <TitleStyle
              // gutterBottom
              variant="caption"
              sx={{
                color: 'text.disabled',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {transactionId}
            </TitleStyle>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TitleStyle
              // gutterBottom
              variant="caption"
              sx={{
                color: 'text.disabled',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {'Amount : '}
              {amount}
            </TitleStyle>
            <TitleStyle
              // gutterBottom
              variant="caption"
              sx={{
                color: 'text.disabled',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {'Quantity : '}
              {quantity}
            </TitleStyle>
          </Stack>

          {/* <InfoStyle>  */}
        </CardContent>
      </Card>
    </Grid>
  );
}
