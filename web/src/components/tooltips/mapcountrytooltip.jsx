import React from 'react';
import { connect } from 'react-redux';

import { useTranslation } from '../../helpers/translation';
import styled from 'styled-components';

import CircularGauge from '../circulargauge';
import CarbonIntensitySquare from '../carbonintensitysquare';
import Tooltip from '../tooltip';
import { ZoneName } from './common';
import { getCO2IntensityByMode } from '../../helpers/zonedata';
import TooltipTimeDisplay from './tooltiptimedisplay';

const mapStateToProps = (state) => ({
  electricityMixMode: state.application.electricityMixMode,
});

const CountryTableHeaderInner = styled.div`
  display: flex;
  flex-basis: 33.3%;
  justify-content: space-between;
  margin-bottom: 5px;

  & .country-col:not(:first-of-type) {
    margin-left: 1.25rem;
  }
`;

const StyledTooltipTimeDisplay = styled(TooltipTimeDisplay)`
  margin-bottom: 5px;
  font-weight: ${(props) => (props.isZoneNameDisplayed ? '500' : '600')};
`;

const TooltipContent = React.memo(
  ({ isDataDelayed, hasParser, co2intensity, fossilFuelPercentage, renewablePercentage }) => {
    const { __ } = useTranslation();
    if (!hasParser) {
      return (
        <div className="no-parser-text">
          <span
            dangerouslySetInnerHTML={{
              __html: __(
                'tooltips.noParserInfo',
                'https://github.com/tmrowco/electricitymap-contrib/wiki/Getting-started'
              ),
            }}
          />
        </div>
      );
    }
    if (!co2intensity) {
      if (isDataDelayed) {
        return <div className="temporary-outage-text">{__('tooltips.dataIsDelayed')}</div>;
      }
      return <div className="temporary-outage-text">{__('tooltips.temporaryDataOutage')}</div>;
    }
    return (
      <div className="zone-details">
        <CountryTableHeaderInner>
          <CarbonIntensitySquare value={co2intensity} />
          <div className="country-col country-lowcarbon-wrap">
            <div id="tooltip-country-lowcarbon-gauge" className="country-gauge-wrap">
              <CircularGauge percentage={fossilFuelPercentage} />
            </div>
            <div className="country-col-headline">{__('country-panel.lowcarbon')}</div>
            <div className="country-col-subtext" />
          </div>
          <div className="country-col country-renewable-wrap">
            <div id="tooltip-country-renewable-gauge" className="country-gauge-wrap">
              <CircularGauge percentage={renewablePercentage} />
            </div>
            <div className="country-col-headline">{__('country-panel.renewable')}</div>
          </div>
        </CountryTableHeaderInner>
      </div>
    );
  }
);

const ZoneNameHeader = styled.div`
  margin-bottom: 5px;
`;

const MapCountryTooltip = ({ electricityMixMode, position, zoneData, onClose, isZoneNameDisplayed }) => {
  if (!zoneData) {
    return null;
  }

  const isDataDelayed = zoneData.delays && zoneData.delays.production;

  const co2intensity = getCO2IntensityByMode(zoneData, electricityMixMode);

  const fossilFuelRatio =
    electricityMixMode === 'consumption' ? zoneData.fossilFuelRatio : zoneData.fossilFuelRatioProduction;
  const fossilFuelPercentage = fossilFuelRatio !== null ? Math.round(100 * (1 - fossilFuelRatio)) : '?';

  const renewableRatio =
    electricityMixMode === 'consumption' ? zoneData.renewableRatio : zoneData.renewableRatioProduction;
  const renewablePercentage = renewableRatio !== null ? Math.round(100 * renewableRatio) : '?';

  return (
    <Tooltip id="country-tooltip" position={position} onClose={onClose}>
      <ZoneNameHeader>
        {isZoneNameDisplayed && <ZoneName zone={zoneData.countryCode} />}
        <StyledTooltipTimeDisplay date={zoneData.stateDatetime} isZoneNameDisplayed={isZoneNameDisplayed} />
      </ZoneNameHeader>
      <TooltipContent
        hasParser={zoneData.hasParser}
        isDataDelayed={isDataDelayed}
        co2intensity={co2intensity}
        fossilFuelPercentage={fossilFuelPercentage}
        renewablePercentage={renewablePercentage}
      />
    </Tooltip>
  );
};

export default connect(mapStateToProps)(MapCountryTooltip);