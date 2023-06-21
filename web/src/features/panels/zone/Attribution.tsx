import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'translation/translation';
import { formatDataSources } from 'utils/formatting';
import { getContributors } from './util';
import { selectedDatetimeIndexAtom } from 'utils/state/atoms';
import { ZoneDetails } from 'types';
export function removeDuplicateSources(source: string | undefined) {
  if (!source) {
    return [''];
  }

  const sources = [
    ...new Set(
      source
        .split('","')
        .flatMap((x) => x.split(',').map((x) => x.replaceAll('\\', '').replaceAll('"', '')))
    ),
  ];

  return sources;
}

export default function Attribution({
  data,
  zoneId,
}: {
  zoneId: string;
  data?: ZoneDetails;
}) {
  const { __, i18n } = useTranslation();
  const [selectedDatetime] = useAtom(selectedDatetimeIndexAtom);
  const selectedData = data?.zoneStates[selectedDatetime.datetimeString];
  const dataSources = selectedData?.source;

  // TODO: Handle sources formatting in DBT or app-backend
  const formattedDataSources = useMemo(() => {
    return formatDataSources(removeDuplicateSources(dataSources), i18n.language);
  }, [dataSources, i18n.language]);

  return (
    <div className="text-sm">
      <span>{__('country-panel.source')}:</span>
      <a
        style={{ textDecoration: 'none' }}
        href="https://github.com/electricitymaps/electricitymaps-contrib/blob/master/DATA_SOURCES.md#real-time-electricity-data-sources"
        target="_blank"
        rel="noreferrer"
        className="text-sky-600 no-underline hover:underline dark:invert"
      >
        {' '}
        <span className="hover:underline">{formattedDataSources || '?'}</span>
      </a>
      <small>
        {' '}
        (
        <span
          className="text-sm text-sky-600 no-underline hover:underline dark:invert"
          dangerouslySetInnerHTML={{
            __html: __(
              'country-panel.addeditsource',
              'https://github.com/electricitymaps/electricitymaps-contrib#data-sources/tree/master/parsers'
            ),
          }}
        />
        )
      </small>
      {'  '}
      {__('country-panel.helpfrom')}
      <ContributorList zoneId={zoneId} />
    </div>
  );
}

function ContributorList({ zoneId }: { zoneId: string }) {
  const { zoneContributors, allContributors } = getContributors(zoneId);
  if (!zoneContributors) {
    return null;
  }

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {zoneContributors.map((contributor) => {
        return (
          <a
            key={allContributors.at(contributor)}
            href={`https://github.com/${allContributors.at(contributor)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              src={`https://avatars.githubusercontent.com/${allContributors.at(
                contributor
              )}?s=20`} // loads the avatar image at a default size of 20px
              srcSet={`https://avatars.githubusercontent.com/${allContributors.at(
                contributor
              )}?s=40 2x`} // loads the avatar image at a default size of 40px for high resolution displays
              alt={allContributors.at(contributor)}
              height="20"
              width="20"
              loading="lazy" // makes sure the image don't load until the user scrolls down
              className="rounded-sm"
            />
          </a>
        );
      })}
    </div>
  );
}
