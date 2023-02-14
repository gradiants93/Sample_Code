import { useStore, Store } from '@company/common';
import { getLocale } from '../util/formatUtils';
import { add, format, parseISO } from 'date-fns';
const store = useStore<Store>();
let dates:[];
// Below check because the placeholder date value in CreateStore cannot be correctly parsed. User should not be able to get to this page without first setting date/time
if (store.event.dateTimes?.[0].date) {
    dates = store.event.dateTimes.map((date) => {
        const ISOdate = parseISO(date.date);
        const times = date.timeRanges.map((range) => {
            const rangeStart = format(add(ISOdate, { minutes: range.startTime }), 'p', {
                locale: getLocale(store.event.locale)
            });
            const rangeEnd = format(add(ISOdate, { minutes: range.endTime }), 'p', {
                locale: getLocale(store.event.locale)
            });
            return `${rangeStart} - ${rangeEnd}`;
        });
        return {
            date: format(ISOdate, 'PP', {
                locale: getLocale(store.event.locale)
            }),
            times
        };
    });
}
