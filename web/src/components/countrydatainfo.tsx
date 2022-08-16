import React, { memo } from 'react';
import styled from 'styled-components';

const DataInfoBox = styled.p`
  background-color: #eee;
  border-radius: 6px;
  padding: 6px;
  font-size: 0.75rem;
  margin: 1rem 0;
`;

// @ts-expect-error TS(2339): Property 'text' does not exist on type '{}'.
const DataInfo = memo(({ text }) => (
  <>
    <DataInfoBox
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    />
    <hr />
  </>
));

export default DataInfo;
