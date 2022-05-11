import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { Box } from '@mui/material';

export const Page = forwardRef(
  ({ children, title = '', meta, ...other }, ref) => (
    <>
      <Helmet>
        <title>{`${title} | Inventory-Mgmt`}</title>
        {meta}
      </Helmet>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  )
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
